const express = require("express")
const userRoutes = express.Router();
const userController = require("../controllers/user.controller")
const identifyUser = require("../middlewares/auth.middleware")

/**
 * @routes POST /api/users/follow/:userId
 * @description Follow a user
 * @access privete
 */
userRoutes.post('/follow/:username',identifyUser,userController.sendFollowRequest)

/**
 * @routes POST /api/users/unfollow/:userId
 * @description unFollow a user
 * @access privete
 */
userRoutes.post('/unfollow/:username',identifyUser,userController.unfollowUserController)

/**
 * @routes POST /api/users/acceptfollow/:username
 * @description accept Follow Request
 * @access privete
 */
userRoutes.post('/acceptfollow/:username',identifyUser,userController.acceptFollowRequest)


/**
 * @routes POST /api/users/rejectfollow/:username
 * @description reject Follow Request
 * @access privete
 */
userRoutes.post('/rejectfollow/:username',identifyUser,userController.rejectFollowRequest)





// sendFollowRequest,
//     unfollowUserController,
//     ,
//     rejectFollowRequest,
//     getPendingRequests

module.exports=userRoutes;