
const Movie = require("../models/Movie");
const User = require("../models/User");
const myList = require("../models/myList");

const createMovieController = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      const newMovie = new Movie(req.body);
      const saveMovie = await newMovie.save();
      res.status(201).json(saveMovie);
    } else {
      res.status(403).json("You are not allowed");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const updateMovieController = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      const updateMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updateMovie);
    } else {
      res.status(403).json("You are not allowed");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const deleteMovieController = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      await Movie.findByIdAndDelete(req.params.id);
      res.status(200).json("Movie has been deleted!");
    } else {
      res.status(403).json("You are not allowed");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getSingleMovieController = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.status(201).json(movie);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getRandomMovieController = async (req, res) => {
  const type = req.query.type;
  let movie;
  try {
    if (type === "series") {
      movie = await Movie.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 1 } },
      ]);
    } else {
      movie = await Movie.aggregate([
        { $match: { isSeries: false } },
        { $sample: { size: 1 } },
      ]);
    }
    res.status(200).json(movie);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//get new random movie
const getNewRandomMovieController = async (req, res) => {
  try {
    const lastYear = new Date().getFullYear();
    const movie = await Movie.aggregate([
      { $match: { year: { $gte: (lastYear - 1).toString() } } },
      { $sample: { size: 1 } },
    ]);
    res.status(200).json(movie);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//get similar movie based on type and genere
const getSimilarMovieController = async (req, res) => {
  try {
    const typeQuery = req.query.type;
    const genre = req.query.genre;
    const movie = req.params.id
    let movies = [];
    if (typeQuery) {
      if (genre) {
        movies = await Movie.aggregate([
          { $match: { isSeries: typeQuery==="movie"? false:true, genre: genre } },
          { $limit: 8 }
        ]);
      } else {
        movies = await Movie.aggregate([
          { $match: { isSeries: typeQuery==="movie"? false:true } },
          { $limit: 8 }
        ]);
      }
    } else {
      movies = await Movie.aggregate([{ $limit: 8 }]);
    }
    res.status(200).json(movies);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//get all movie admin
const getMovieController = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      const movies = await Movie.find();
      res.status(201).json(movies.reverse());
    } else {
      res.status(403).json("You are not allowed");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const searchMovieController = async (req, res) => {
  const { query } = req.query;
  try {
    const movies = await Movie.find({
      title: { $regex: query, $options: "i" },
    });
    res.status(201).json(movies);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

//update Like and disLike
const LikeController = async (req,res) => {
  const { movieId,listId } = req.body;
  try {
    const userList = await myList.findById(listId);
    const movie = await Movie.findById(movieId);

    if (!userList.likeMovies.includes(movieId)) {
      if (userList.dislikeMovies.includes(movieId)) {
        userList.dislikeMovies.pull(movieId);
        movie.dislikes--;
      }
      userList.likeMovies.push(movieId);
      movie.likes++;
      await userList.save();
      await movie.save();
      res.status(200).json({message: 'Liked successfully' });
    }else{
      userList.likeMovies.pull(movieId);
      movie.likes--;
      await userList.save();
      await movie.save();
      res.status(200).json({message: 'Movie Remove From Like' });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({error: 'Internal server error' });
  }
}

const DisLikeController = async (req,res) => {
  const { movieId,listId } = req.body; 

  try {
    const userList = await myList.findById(listId);
    const movie = await Movie.findById(movieId);
    if (!userList.dislikeMovies.includes(movieId)) {
      if (userList.likeMovies.includes(movieId)) {
        userList.likeMovies.pull(movieId);
        movie.likes--;
      }
      userList.dislikeMovies.push(movieId);
      movie.dislikes++;
      await userList.save();
      await movie.save();
      res.status(200).json({ message: 'Disliked successfully' });
    }else{
      userList.dislikeMovies.pull(movieId);
      movie.dislikes--;
      await userList.save();
      await movie.save();
      res.status(200).json({ message: 'Movie remove from dislike' });
    }

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
module.exports = {
  getMovieController,
  getRandomMovieController,
  getSingleMovieController,
  createMovieController,
  updateMovieController,
  deleteMovieController,
  getNewRandomMovieController,
  searchMovieController,
  getSimilarMovieController,
  LikeController,
  DisLikeController
};
