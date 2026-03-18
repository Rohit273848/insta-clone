const mongoose = require('mongoose')

 const postSchema = new mongoose.Schema({
    caption:{
         type:String,
         default:""       
    },
    imgUrl:{
        type:String,
        required:[true,"ImgUrl is required for creating an post"]
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:[true,"user is required for creating an post"]
    }
 })

 const  PostModel = mongoose.model("Posts",postSchema)

 module.exports=PostModel 