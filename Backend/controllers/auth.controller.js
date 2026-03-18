const mongoose = require('mongoose')
const userModel = require("../models/user.models")
const bcrypt=require("bcryptjs")
const jwt = require('jsonwebtoken');





async function registerController (req,res){
    const {username,email,password,bio,profileImage}=req.body;

    const isUserAlreadyExists =  await userModel.findOne({
        $or:[
            {email},
            {username},
        ]
    });

    if(isUserAlreadyExists){
        return res.status(409).json({
            message:"User already exists"+(isUserAlreadyExists.email==email?"email already exists":"user name already exists")
        })
    }
    
    const hash =await bcrypt.hash(password,10);

    const user = await userModel.create({
        username,
        email,
        password:hash,
        bio,
        profileImage,
    })

    const token = jwt.sign(
        {
            id:user._id
        },
        process.env.JWT_SECRET
    )

    res.cookie("token",token);

    res.status(201).json({
        message:'User Register Successfully',
        user:{
            username:user.username,
            email:user.email,
            bio:user.bio,
            profileImage:user.profileImage,
        }
    })
   
}





async function loginController (req,res){
    const {username,password}=req.body;
   
    const user=await userModel.findOne({username});
   
    if(!user){
       return res.status(401).json({
           message:"Invalid Email or Password"
       })
    }
    
    const isPasswordValid =await bcrypt.compare(password,user.password);
   
    if(!user.password){
    return res.status(401).json({
     message:"Invalid Email or Password"
    })
    }
   
    const token = jwt.sign(
       {
           id:user._id,
       },
       process.env.JWT_SECRET,
    )
   
    res.cookie("token",token);
   
    res.status(200).json({
       message:"Login Successfully",
       user:{
           username:user.username,
           email:user.email,
           bio:user.bio,
           profileImage:user.profileImage
       }
    });
   
   }

module.exports={
    loginController,
    registerController
}