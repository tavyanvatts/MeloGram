const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  playlists: [
    {
      name: String,
      songs: [String]
    }
  ],

  favourites: [String],

  todaysVibe: {
    type: String,
    default: "no vibes today"
  }
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);