const express = require("express");
const router = express.Router();

const User = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/signup", async (req, res) => {

  try {

    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword
    });

    await newUser.save();

    res.json({ message: "User created successfully" });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

module.exports = router;