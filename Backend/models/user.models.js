const mongoose  = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true,"userName is required"],
        unique: [true,"user name is already exists"],
    },
    email: {
        type: String,
        required: [true,"Email is required"],
        unique: [true,"Email is already exists"],
    },
    password: {
        type: String,
        required: [true,"Password is required"],
    },
    bio: {
        type: String,
        default: "",
    },
    profileImage: {
        type: String,
        default: null,
    }
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;


