const { intializeDatabase } = require("./db/db.connect");
const Movie = require("./models/movie.models");

const express = require("express");
const app = express();
app.use(express.json());

intializeDatabase();

const cors = require("cors");
app.use(cors());

// const fs = require("fs"); "to create a new movie."
// const { release } = require("os");

// const newMovie = {
//   title: "RAJA AKASH",
//   releaseYear: 2003,
//   genre: ["Action"],
//   director: "Aditya Roy Chopra",
//   actors: ["Actor 1", "Actor 2"],
//   language: "Hindi",
//   country: "India",
//   rating: 7.0,
//   plot: "A young man and woman fall in love on a Indian trip.",
//   awards: "IFA Filmfare Awards",
//   posterUrl: "https://example.com/new-poster1.jpg",
//   trailerUrl: "https://example.com/new-trailer1.mp4",
// };

async function createMovie(newMovie) {
  try {
    const hindiMovie = new Movie(newMovie);
    const saveMovie = await hindiMovie.save();
    // console.log("New movie data: ", saveMovie);
    return saveMovie;
  } catch (error) {
    throw error;
  }
}
// createMovie(newMovie);
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

// find a movie with particular title ---
// (edit: getting movie by title using express)
async function readMovieByTitle(movieTitle) {
  try {
    const movie = await Movie.findOne({ title: movieTitle });
    // console.log("Movie data: ", movie); db learn ke liye tha
    // se express se direct connect ke liye
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

// readMovieByTitle("Bajrangi Bhaijaan"); mongo

// to get all the movies from database
async function readAllMovies() {
  try {
    const allMovies = await Movie.find();
    // console.log("All movies form database:", allMovies);
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

// get movie by director
async function readMovieByDirector(directorName) {
  try {
    const movieByDirector = await Movie.find({ director: directorName });
    // const movieByDirector = await Movie.findOne({ director: directorName });
    // console.log(movieByDirector);
    return movieByDirector;
  } catch (error) {
    console.log("Error while getting movie by director.", error);
  }
}
// readMovieByDirector("Kabir Khan");

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

// find a movie bt id and update its rating.
async function updateMovie(movieId, dataToUpdate) {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(movieId, dataToUpdate, {
      new: true,
    });
    // console.log("Movie rating is updated", updatedMovie);
    return updatedMovie;
  } catch (error) {
    console.log("Error in updating the movie rating.", error);
  }
}

app.post("/movies/:moviesId", async (req, res) => {
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

// updateMovie("66ed0693758690323fbf4382", { plot: 'A young man and woman fall in love on a Punjab trip.' });

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
// updateMovieDetail("Dilwale Dulhania Le Jayenge", { rating: 9.0 });

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
    res.status(200).json({ message: "Movie deleted successfully." });
  } catch {
    res.status(404).json({ error: "Failed to delete Movie." });
  }
});

// deleteMovie("66ed0693758690323fbf4388");
async function deleteMovieByName(movieName) {
  try {
    const deleteMovie = await Movie.findOneAndDelete({ title: movieName });
    console.log("Deleted Movie:", deleteMovie);
  } catch {
    console.log("Error in deleting movie.", error);
  }
}
// deleteMovieByName("New MOvie");

// const jsonData = fs.readFileSync("movies.json", "utf-8");
// const moviesData = JSON.parse(jsonData);

//this is done to send data from movies.json to mongo db server.

// function seedData() {
//   try {
//     for (const movieData of moviesData) {
//       const newMovie = new Movie({
//         title: movieData.title,
//         releaseYear: movieData.releaseYear,
//         genre: movieData.genre,
//         director: movieData.director,
//         actors: movieData.actors,
//         language: movieData.language,
//         country: movieData.country,
//         rating: movieData.rating,
//         plot: movieData.plot,
//         awards: movieData.awards,
//         posterUrl: movieData.posterUrl,
//         trailerUrl: movieData.trailerUrl,
//       });
//       newMovie.save();
//     }
//   } catch (error) {
//     console.log("Error seeding the data", error);
//   }
// }
// seedData();

const PORT = 3000;

app.listen(PORT, () => {
  console.log("Server is running on port -", PORT);
});
