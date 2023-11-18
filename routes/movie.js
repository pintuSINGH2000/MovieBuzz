const router = require("express").Router();
const verify = require("../verifyToken");

const {
  getMovieController,
  getRandomMovieController,
  getSingleMovieController,
  deleteMovieController,
  updateMovieController,
  createMovieController,
  getNewRandomMovieController,
  searchMovieController,
  getSimilarMovieController,
  updateReviewController,
  LikeController,
  DisLikeController,
} = require("../controller/movieController");


//Create
router.post("/", verify, createMovieController);

//update
router.put("/:id", verify, updateMovieController);

//delete
router.delete("/:id", verify, deleteMovieController);

//get
router.get("/find/:id", getSingleMovieController);

//get random
router.get("/random", getRandomMovieController);

//get new random
router.get("/newrandom",getNewRandomMovieController);

//get all
router.get("/", verify, getMovieController);

//search
router.get("/search",searchMovieController);

//similar movie
router.get("/similar/:id",getSimilarMovieController);

router.post("/like",LikeController);

router.post("/dislike",DisLikeController);

module.exports = router;
