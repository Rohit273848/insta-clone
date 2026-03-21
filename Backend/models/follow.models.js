const mongoose = require("mongoose")

const followSchema =new mongoose.Schema({
    follower:{
       type:String
    },
    followee:{
        type:String
    },
    status:{
        type:String,
        default:'pending',
        enum:{
            values:['pending','accepted','rejected'],
            message:"status can only be padding , accepted and rejected"
        }
    }
},{
    timestamps:true,
})

followSchema.index({follower:1,followee:1},{unique:true})

const followeModel = mongoose.model('follows',followSchema);

module.exports=followeModel;