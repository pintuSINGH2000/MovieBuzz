const List = require("../models/List");
const Movie = require("../models/Movie");

const createMovieListController = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      const newList = new List(req.body);
      const savedList = await newList.save();
      res.status(201).json(savedList);
    } else {
      res.status(403).json("You are not allowed");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const deleteMovieListController = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      await List.findByIdAndDelete(req.param.id);
      res.status(201).json("List has been deleted");
    } else {
      res.status(403).json("You are not allowed");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getMovieListController = async (req, res) => {
  try {
    const typeQuery = req.query.type;
    const genre = req.query.genre;
    let list = [];
    if (typeQuery) {
      if (genre) {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery, genre: genre } },
        ]);
      } else {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery } },
        ]);
      }
    } else {
      list = await List.aggregate([{ $sample: { size: 10 } }]);
    }
    res.status(200).json(list);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getNewAndPopularListController = async (req, res) => {
  try {
    const list = await List.aggregate([
      { $match: {  $or: [
        { type: "" },
        { type: { $exists: false } }
      ] } },
    ]);
    res.status(200).json(list);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
module.exports = {
  createMovieListController,
  deleteMovieListController,
  getMovieListController,
  getNewAndPopularListController
};
