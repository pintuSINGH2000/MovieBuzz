const mongoose = require("mongoose");

const myListSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    movies: {
      type: [
      {
        movie: { type: mongoose.ObjectId, ref: "Movie", required: true },
        isSeries:{
            type:Boolean,
            default:false
        }
      }],
      required:true,
    },
    likeMovies : [{ type: mongoose.ObjectId, ref: 'Movie' }],
    dislikeMovies : [{ type: mongoose.ObjectId, ref: 'Movie' }],
  },
  { timestamp: true }
);

module.exports = mongoose.model("Mylist", myListSchema);

