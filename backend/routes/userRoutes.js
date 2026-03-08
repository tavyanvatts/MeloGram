const express = require("express");
const router = express.Router();

const User = require("../models/user");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/follow", authMiddleware, async (req, res) => {

  try {

    const { userId } = req.body;

    const currentUser = await User.findById(req.user.id);
    const userToFollow = await User.findById(userId);

    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    if (currentUser.following.includes(userId)) {
      return res.status(400).json({ message: "Already following" });
    }

    currentUser.following.push(userId);
    userToFollow.followers.push(currentUser._id);

    await currentUser.save();
    await userToFollow.save();

    res.json({ message: "User followed successfully" });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

router.post("/unfollow", authMiddleware, async (req, res) => {

  try {

    const { userId } = req.body;

    const currentUser = await User.findById(req.user.id);
    const userToUnfollow = await User.findById(userId);

    if (!userToUnfollow) {
      return res.status(404).json({ message: "User not found" });
    }

    currentUser.following = currentUser.following.filter(
      id => id.toString() !== userId
    );

    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => id.toString() !== req.user.id
    );

    await currentUser.save();
    await userToUnfollow.save();

    res.json({ message: "User unfollowed successfully" });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

router.get("/followers/:id", async (req, res) => {

  try {

    const user = await User.findById(req.params.id)
      .populate("followers", "username");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.followers);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

router.get("/followers/:id", async (req, res) => {

  try {

    const user = await User.findById(req.params.id)
      .populate("followers", "username");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.followers);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

module.exports = router;