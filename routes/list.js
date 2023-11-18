const router = require("express").Router();
const verify = require("../verifyToken");
const {
  getMovieListController,
  deleteMovieListController,
  createMovieListController,
  getNewAndPopularListController,
} = require("../controller/listController");

//Create
router.post("/", verify, createMovieListController);

//delete
router.delete("/:id", verify, deleteMovieListController);

//get list
router.get("/", getMovieListController);

//get new and Popular
router.get("/new-popular",getNewAndPopularListController); 

module.exports = router;
