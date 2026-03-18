const express = require("express")
const userRoutes = express.Router();
const followUserController = require("../controllers/user.controller")


/**
 * @routes POST /api/users/follow/:userId
 * @description Follow a user
 * @access privete
 */
userRoutes.post('/follow/:userId')

module.exports=userRoutes;