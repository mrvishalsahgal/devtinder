const User = require("../models/user");
const { userAuth } = require("../middleware/auth");
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

authRouter.patch("/forgot-password", userAuth, async (req, res) => {
  try {
    const isMatch = await req.user.validatePassword(req.body.oldpass);
    if (!isMatch) {
      throw new Error("Invalid old password");
    }
    const hashPassword = await bcrypt.hash(req.body.newpass, 10);
    req.user.password = hashPassword;
    await req.user.save();
    res.send("Password updated successfully");
  } catch (error) {
    res.status(500).send("ERROR: " + error.message);
  }
});

module.exports = authRouter;
