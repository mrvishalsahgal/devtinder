const User = require("../models/user");
const express = require("express");
const authRouter = express.Router();
const { validatorSignup } = require("../utils/validate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

authRouter.post("/signup", async (req, res) => {
  try {
    validatorSignup(req);
    const { firstName, lastName, email, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });
    await user.save();
    res.send("User created successfully");
  } catch (error) {
    res.status(500).send("ERROR: " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("invalid crendiatials");
    }
    const isMatch = await user.validatePassword(password);
    if (!isMatch) {
      throw new Error("invalid crendiatials");
    }

    const token = user.getJWTToken();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });
    res.send("user logged in successfully");
  } catch (error) {
    res.status(500).send("ERROR: " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.send("user logged out successfully");
  } catch (error) {
    res.status(500).send("ERROR: " + error.message);
  }
});

module.exports = authRouter;
