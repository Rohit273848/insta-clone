const mongoose = require("mongoose");
const followeModel = require('../models/follow.models')
const userModel = require("../models/user.models")

async function sendFollowRequest(req, res) {
    try {
        const followerUsername = req.user.username;
        const followeeUsername = req.params.username;

        if (followerUsername === followeeUsername) {
            return res.status(400).json({
                message: "You cannot follow yourself"
            });
        }

        const followeeUser = await userModel.findOne({
            username: followeeUsername
        });

        if (!followeeUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isAlreadyFollow = await followeModel.findOne({
            follower: followerUsername,
            followee: followeeUsername
        });

        if (isAlreadyFollow) {
            return res.status(400).json({
                message: `Request already ${isAlreadyFollow.status}`
            });
        }

        const followRecord = await followeModel.create({
            follower: followerUsername,
            followee: followeeUsername,
            status: "pending"
        });

        res.status(201).json({
            message: `Follow request sent to ${followeeUsername}`,
            follow: followRecord
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

async function acceptFollowRequest(req, res) {
    try {
        const requestUsername = req.params.username;

        const follow = await followeModel.findOne({
            followee: req.user.username,
            follower: requestUsername
        });

        if (!follow) {
            return res.status(404).json({
                message: "Request not found"
            });
        }

        if (follow.status !== "pending") {
            return res.status(400).json({
                message: "Request already processed"
            });
        }

        follow.status = "accepted";
        await follow.save();

        res.json({
            message: "Follow request accepted",
            follow
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function rejectFollowRequest(req, res) {
    try {
        const requestUsername = req.params.username;

        const follow = await followeModel.findOne({
            followee: req.user.username,
            follower: requestUsername
        });

        if (!follow) {
            return res.status(404).json({
                message: "Request not found"
            });
        }

        if (follow.status !== "pending") {
            return res.status(400).json({
                message: "Request already processed"
            });
        }

        follow.status = "rejected";
        await follow.save();

        res.json({
            message: "Follow request rejected"
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function getPendingRequests(req, res) {
    try {
        const username = req.user.username;

        const requests = await followeModel.find({
            followee: username,
            status: "pending"
        }).populate("follower", "username profilePic");

        res.json(requests);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function unfollowUserController(req, res) {
    try {
        const followerUsername = req.user.username;
        const followeeUsername = req.params.username;

        const followeeUser = await userModel.findOne({
            username: followeeUsername
        });

        if (!followeeUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isUserFollowing = await followeModel.findOne({
            follower: followerUsername,
            followee: followeeUsername
        });

        if (!isUserFollowing) {
            return res.status(400).json({
                message: `You are not following ${followeeUsername}`
            });
        }

        if (isUserFollowing.status !== "accepted") {
            return res.status(400).json({
                message: "Follow request not accepted yet"
            });
        }

        await followeModel.findByIdAndDelete(isUserFollowing._id);

        res.status(200).json({
            message: `Successfully unfollowed ${followeeUsername}`
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}


module.exports = {
    sendFollowRequest,
    unfollowUserController,
    acceptFollowRequest,
    rejectFollowRequest,
    getPendingRequests
};