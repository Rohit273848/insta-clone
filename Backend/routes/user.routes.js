const express = require("express")
const userRoutes = express.Router();
const userController = require("../controllers/user.controller")
const identifyUser = require("../middlewares/auth.middleware")

/**
 * @routes POST /api/users/follow/:userId
 * @description Follow a user
 * @access privete
 */
userRoutes.post('/follow/:username',identifyUser,userController.followUserController)

/**
 * @routes POST /api/users/unfollow/:userId
 * @description unFollow a user
 * @access privete
 */
userRoutes.post('/unfollow/:username',identifyUser,userController.unfollowUserController)

module.exports=userRoutes;