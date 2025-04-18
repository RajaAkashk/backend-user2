const { intializeDatabase } = require("./db/db.connect");
const Movie = require("./models/movie.models");

const express = require("express");
const app = express();
app.use(express.json());

intializeDatabase();

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// to get all the movies from database
async function readAllMovies() {
  try {
    const allMovies = await Movie.find();
    return allMovies;
  } catch (error) {
    throw error;
  }
}
app.get("/movies", async (req, res) => {
  try {
    const movies = await readAllMovies();
    if (movies.length != 0) {
      res.json(movies);
    } else {
      res.status(404).json({ error: "No movies found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies." });
  }
});

// app.get("/", async (req, res) => {
//   try {
//     const movies = await Movie.find();
//     if (movies.length === 0) {
//       res.status(404).json({ message: "Movie not found" });
//     }
//     res.status(200).json({ message: "Successfully getting movies", movies });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch movies",error });
//   }
// });

async function createMovie(newMovie) {
  try {
    const hindiMovie = new Movie(newMovie);
    const saveMovie = await hindiMovie.save();
    return saveMovie;
  } catch (error) {
    throw error;
  }
}
app.post("/movies", async (req, res) => {
  try {
    const savedMovie = await createMovie(req.body);
    res
      .status(201)
      .json({ message: "Movie addded successfully.", movie: savedMovie });
  } catch {
    res.status(500).json({ error: "Failed to add data." });
  }
});

// app.post("/", async (req, res) => {
//   try {
//     const newMovie = new Movie(req.body);
//     const savedMovie = await newMovie.save();
//     res
//       .status(201)
//       .json({ message: "Successfully added new movie", savedMovie });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to add a movie", error });
//   }
// });

async function readMovieByTitle(movieTitle) {
  try {
    const movie = await Movie.findOne({ title: movieTitle });
    return movie;
  } catch (error) {
    throw error;
  }
}

app.get("/movies/:title", async (req, res) => {
  try {
    const movie = await readMovieByTitle(req.params.title);
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ error: "Movie not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movie." });
  }
});

// get movie by director
async function readMovieByDirector(directorName) {
  try {
    const movieByDirector = await Movie.find({ director: directorName });
    return movieByDirector;
  } catch (error) {
    console.log("Error while getting movie by director.", error);
  }
}

app.get("/movies/director/:directorName", async (req, res) => {
  try {
    const movies = await readMovieByDirector(req.params.directorName);
    if (movies.length != 0) {
      res.json(movies);
    } else {
      res.status(404).json({ error: "No movies found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies." });
  }
});

// get movie by genre
async function readMovieByGenre(movieGenre) {
  try {
    const moviesByGenre = await Movie.find({ genre: movieGenre });
    return moviesByGenre;
  } catch (error) {
    console.log("error in getting movie by genre.", error);
  }
}

app.get("/movies/genres/:genreName", async (req, res) => {
  try {
    const movies = await readMovieByGenre(req.params.genreName);
    if (movies != 0) {
      res.json(movies);
    } else {
      res.status(404).json({ error: "No movie found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies data." });
  }
});

// find a movie by id and update
async function updateMovie(movieId, dataToUpdate) {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(movieId, dataToUpdate, {
      new: true,
    });
    return updatedMovie;
  } catch (error) {
    console.log("Error in updating the movie rating.", error);
  }
}

app.put("/movies/:moviesId", async (req, res) => {
  try {
    const movie = await updateMovie(req.params.moviesId, req.body);
    if (movie) {
      res.status(200).json({
        message: "Movie updated successfully.",
        UPDATED: movie,
      });
    } else {
      res.status(404).json({ error: "Movie not found." });
    }
  } catch {
    res.status(500).json({ error: "Failed to update movie." });
  }
});

// find one data and update its value
async function updateMovieDetail(movieTitle, updatedRating) {
  try {
    const updatedMovie = await Movie.findOneAndUpdate(
      { title: movieTitle },
      updatedRating,
      { new: true }
    );
    console.log(updatedMovie);
  } catch (error) {
    console.log("Error in changing data.", error);
  }
}

// find a movie by id and delete from database
async function deleteMovie(movieId) {
  try {
    const deleteMovie = await Movie.findByIdAndDelete(movieId);
    return deleteMovie;
  } catch (error) {
    console.log("Error in deleting movie.", error);
  }
}

app.delete("/movies/:movieId", async (req, res) => {
  try {
    const deletedMovie = await deleteMovie(req.params.movieId);
    res
      .status(200)
      .json({ message: "Movie deleted successfully.", movie: deletedMovie });
  } catch {
    res.status(404).json({ error: "Failed to delete Movie." });
  }
});

async function deleteMovieByName(movieName) {
  try {
    const deleteMovie = await Movie.findOneAndDelete({ title: movieName });
    console.log("Deleted Movie:", deleteMovie);
  } catch {
    console.log("Error in deleting movie.", error);
  }
}

const PORT = 3000;

app.listen(PORT, () => {
  console.log("Server is running on port -", PORT);
});

module.exports = app;
