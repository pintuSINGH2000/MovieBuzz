const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    desc:{
        type:String,
    },
    img:{
        type:String,
    },
    imgTitle:{
        type:String,
    },
    imgSm:{
        type:String,
    },
    trailer:{
        type:String,
    },
    video:{
        type:String
    },
    year:{
        type:String
    },
    limit:{
        type:String
    },
    genre:{
        type:String
    },
    isSeries:{
        type:Boolean,
        default:false
    },
    duration:{
     type:String
    },
    likes:{
        type:Number,
        default:0
    },
    dislikes:{
        type:Number,
        default:0
    }
},{timestamp:true});

module.exports = mongoose.model("Movie",movieSchema);