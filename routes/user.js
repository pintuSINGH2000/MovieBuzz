const router = require("express").Router();
const verify = require("../verifyToken");
const {
  updateUserController,
  deleteUserController,
  getSingleUserController,
  getUserController,
  getUserStats,
  addMylistController,
  removeMylistController,
  getMylistController,
} = require("../controller/userController");



//update
router.put("/:id", verify, updateUserController);

//Delete
router.delete("/:id", verify, deleteUserController);

//get
router.get("/find/:id", getSingleUserController);

//getAll
router.get("/", verify, getUserController);

//get user stats
router.get("/statc", getUserStats);

//add movie to mylist
router.post("/add/:userId", addMylistController);

//remove movie from mylist
router.delete("/remove/:uid/:vid", removeMylistController);

//get movie from my list
router.get("/mylist/:uid",getMylistController);

module.exports = router;
