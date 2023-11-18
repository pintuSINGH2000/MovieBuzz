const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    type:{
        type:String
    },
    genre:{
        type:String
    },
    content:{
        type:Array
    }
},{timestamp:true});

module.exports = mongoose.model("List",listSchema);