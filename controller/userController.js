const User = require("../models/User");
const CryptoJS = require("crypto-js");
const JWT = require("jsonwebtoken");
const myList = require("../models/myList");

const updateUserController = async (req, res) => {
  try {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
          req.body.password,
          process.env.SECRET_KEY
        ).toString();
      }
      const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updateUser);
    } else {
      res.status(403).json("You can update only your account");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//delete

const deleteUserController = async (req, res) => {
  try {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted");
    } else {
      res.status(403).json("You can delete only your account");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//get single user
const getSingleUserController = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...info } = user._doc;
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//get all user
const getUserController = async (req, res) => {
  try {
    const query = req.query.new;
    if (req.user.isAdmin) {
      const users = query
        ? await User.find().sort({ _id: -1 }).limit(10)
        : await User.find();
      await User.find({});
      res.status(200).json(users);
    } else {
      res.status(403).json("You are not allowed to see all user");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//user stats
const getUserStats = async (req, res) => {
  try {
    const today = new Date();
    const lastYear = today.setFullYear(today.setFullYear() - 1);
    const month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "Octeber",
      "November",
      "December",
    ];

    const data = await User.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//add to my list
const addMylistController = async (req, res) => {
  const { userId } = req.params;
  const { type, videoId } = req.body;

  try {
    const updatedList = await myList.findOneAndUpdate(
      {user: userId},
      {
        $addToSet: { 
          movies: { 
            movie: videoId, 
            isSeries: type 
          } 
        },
      },
      { new: true, upsert: true }
    );

    if (!updatedList) {
      return res.status(404).json({ message: "List not found" });
    }
    const lastAddedMovie = updatedList.movies[updatedList.movies.length - 1]; // Get the last added movie

    res.status(201).json({ movie: lastAddedMovie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while adding the movie" });
  }
};

//remove from my list

const removeMylistController = async (req, res) => {
  try {
    const { uid, vid } = req.params;

    const myListUpdate = await myList.findOneAndUpdate(
      { user: uid },
      { $pull: { movies: { movie: vid } } },
      { new: true }
    );
    res.status(200).json({message: "Video removed from user list" });
  } catch (error) {
    res.status(500).send(error);
  }
};

//get my list
const getMylistController = async (req, res) => {
  const uid  = req.params.uid;
  try {
    const moviesId = await myList.findOne({ user: uid });
    res.status(200).json(moviesId);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

module.exports = {
  updateUserController,
  deleteUserController,
  getSingleUserController,
  getUserController,
  getUserStats,
  addMylistController,
  removeMylistController,
  getMylistController,
};
