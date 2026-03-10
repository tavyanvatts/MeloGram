const express = require("express");
const router = express.Router();

const Activity = require("../models/activity");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, async (req, res) => {

  try {

    const currentUser = await User.findById(req.user.id);

    const activities = await Activity.find({
      user: { $in: currentUser.following }
    })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.json(activities);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

module.exports = router;