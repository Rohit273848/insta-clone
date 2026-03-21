  const postmodel = require("../models/post.models");
  const ImageKit = require("@imagekit/nodejs");
  const { toFile } = require("@imagekit/nodejs");
  const jwt=require('jsonwebtoken')
  const likeModel=require('../models/like.models')

  const imagekit = new ImageKit({
  //   publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  //   urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });

  async function createPostController(req, res) {
    try {

      // const token = req.cookies.token;

      // if(!token){
      //     return res.status(401).json({
      //         message:"token is not found"
      //     })
      // }

      // let decode=null;
      // try{
      //     decode =  jwt.verify(token,process.env.JWT_SECRET)
      // }catch(err){
      //     return res.status(401).json({
      //         message:"user not authorized"
      //     })
      // }

      // console.log(decode);
      


      if (!req.file) {
        return res.status(400).json({
          message: "Image is required",
        });
      }

      console.log(req.file);

      const file = await imagekit.files.upload({
        file: await toFile(req.file.buffer, req.file.originalname),
        fileName: req.file.originalname,
        folder:"insta-clone/posts"
      });
  
      res.send(file)

      // res.json({
      //   message: "Image uploaded successfully",
      //   url: uploadedFile.url,
      // });

      const post = await postmodel.create({
          caption:req.body.caption,
          imgUrl:file.url,
          user:req.user.id

      })

      return res.status(201).json({
          message:"Post Created successfuly",
          post
      })

    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Upload failed",
      });
    }
  }

  async function getPostController(req,res) {
    
    // const token = req.cookies.token;

    // if(!token){
    //   return res.status().json({
    //     message:"token is not found"
    //   })
    // }

    // let decoded =null
    
    // try{
    //   decoded = await jwt.verify(token,process.env.JWT_SECRET);
    // }catch(err){
    //   return res.status(401).json({
    //     message:"user is not authorize"
    //   })
    // }

    const userId = req.user.id;

    
    const posts = await postmodel.find({
      user:userId,
    })

    res.status(200).json({
      message:"post get successfuly",
      posts
    })

  }

  async function getPostDetailController(req,res){
    

    const userId = req.user.id;
    const postId= req.params.postId;


    const post = await postmodel.findById(postId);

    if(!post){
      return res.status(404).json({
        message:"post not found."
      })
    }

    const isValidUser = post.user.toString()===userId;

    if(!isValidUser){
      return res.status(403).json({
        message:"Forbidden content."
      })
    }

    res.status(200).json({
        message:"Post fetched successfully",
        post
    })

  }

  async function likePostController(req,res){

    const username=req.user.username;
    const postId=req.params.postId;

    const post= await postmodel.findById(postId)

    if(!post){
      return res.status(404).json({
        message:"post not found"
      })
    }

    await likeModel.create({
      post:postId,
      user:username
    })

    res.status(200).json({
      message:"post liked successfuly",
      post
    })

  }

  module.exports = {
    createPostController,
    getPostController,
    getPostDetailController,
    likePostController
  };