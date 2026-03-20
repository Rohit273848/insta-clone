const mongoose = require("mongoose");
const followeModel = require('../models/follow.models')
const userModel = require("../models/user.models")

async function followUserController(req,res){

    try{
    const followerUsername = req.user.username;
    const followeeUsername = req.params.username;

    // ❌ Prevent self follow
    if(followerUsername==followeeUsername){
        return res.status(400).json({
            message:"you cant follow youself"
        })
    }

       // ✅ Find followee user
    const followeeUser=await userModel.findOne({
        username:followeeUsername
    })

    if(!followeeUser){
        return res.status(4040).json({
            message:"user not found"
        });
    }

     // ❌ Prevent duplicate follow
     const isAlreadyFollow=await followeModel.findOne({
        follower:followerUsername,
        followee:followeeUsername
     })
     if(isAlreadyFollow){
        return res.status(200).json({
            message:`your already following ${followee}`
        })
     }





    const followRecord = await followeModel.create({
        follower:followerUsername,
        followee:followeeUsername
    })

    res.status(201).json({
        message:`you are following ${followeeUsername}`,
        follow:followRecord
    })
}catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message
    });
  }

}

module.exports={
    followUserController
}