const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profilePic:{
        data:Buffer,
        contentType:String,
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    plan:{
        type:Number,
        required:true
    },
    expiryDate: {
        type: Date,
        required: true
    }
    
},{timestamp:true});

module.exports = mongoose.model("User",userSchema);