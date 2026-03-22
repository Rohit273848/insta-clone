const express = require('express');
const authRouter = express.Router();
const authController=require('../controllers/auth.controller')
const identifyUser = require('../middlewares/auth.middleware')



authRouter.post('/register',authController.registerController)

authRouter.post("/login",authController.loginController)


/**
 * @routes GET /api/users/get-me
 * @description return current logedin user's detail
 * @access privete
 */
authRouter.get("/get-me",identifyUser,authController.getMeController)

module.exports=authRouter;