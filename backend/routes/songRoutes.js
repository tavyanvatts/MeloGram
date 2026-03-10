const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/search", async (req, res) => {

  try {

    const query = req.query.q;

    const response = await axios.get(
      "https://itunes.apple.com/search",
      {
        params: {
          term: query,
          entity: "song",
          limit: 25
        }
      }
    );

    const uniqueSongs = [];
    const seen = new Set();

    response.data.results.forEach(song => {

      const key = song.trackName + song.artistName;

      if (!seen.has(key)) {

        seen.add(key);

        uniqueSongs.push({
          title: song.trackName,
          artist: song.artistName,
          preview: song.previewUrl,
          cover: song.artworkUrl100
        });

      }

    });

    res.json(uniqueSongs);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

module.exports = router;