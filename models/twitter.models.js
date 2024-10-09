const mongoose = require("mongoose");

const TwitterSchema = new mongoose.Schema({
  profilePic: String,
  fullName: String,
  username: String,
  bio: String,
  companyName: String,
  city: String,
  portfolioLink: String,
  handle: String,
  followersCount: Number,
  following: Number,
  isOnlline: Boolean,
});

const Twitter = mongoose.model("Twitter", TwitterSchema);

module.exports = Twitter;
