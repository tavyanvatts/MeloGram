const express = require("express");
const router = express.Router();

const Playlist = require("../models/playlist");
const authMiddleware = require("../middleware/authMiddleware");
const Activity = require("../models/activity");
const User = require("../models/User");

router.post("/create", authMiddleware, async (req, res) => {

  try {

    const { name } = req.body;

    const playlist = new Playlist({
      name,
      user: req.user.id,
      songs: []
    });

    await playlist.save();

    const Activity = require("../models/activity");
const User = require("../models/User");

const user = await User.findById(req.user.id);

const activity = new Activity({
  user: user._id,
  type: "playlist_create",
  message: `${user.username} created playlist ${name}`
});

await activity.save();

    res.json({
      message: "Playlist created",
      playlist
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

router.post("/add-song", authMiddleware, async (req, res) => {

  try {

    const { playlistId, title, artist } = req.body;

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    playlist.songs.push({
      title,
      artist
    });

    await playlist.save();

    res.json({
      message: "Song added",
      playlist
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});


router.delete("/remove-song", authMiddleware, async (req, res) => {

  try {

    const { playlistId, songId } = req.body;

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    if (playlist.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    playlist.songs = playlist.songs.filter(
      song => song._id.toString() !== songId
    );

    await playlist.save();

    res.json({
      message: "Song removed",
      playlist
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

router.get("/my-playlists", authMiddleware, async (req, res) => {

  try {

    const playlists = await Playlist.find({
      user: req.user.id
    });

    res.json(playlists);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

router.delete("/:id", authMiddleware, async (req, res) => {

  try {

    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    if (playlist.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Playlist.findByIdAndDelete(req.params.id);

    res.json({
      message: "Playlist deleted successfully"
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

module.exports = router;