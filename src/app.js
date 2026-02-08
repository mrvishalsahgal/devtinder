const express = require("express");
const app = express();
const connectDB = require("./config/database");
const { userAuth } = require("./middleware/auth");
const User = require("./models/user");
const { validatorSignup } = require("./utils/validate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user);
});

app.get("/connections", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user.firstName + " sent a connection request");
});

connectDB()
  .then(() => {
    console.log("MongoDB connected");
    app.listen(3000, () => {
      console.log("Server started on port 3000");
    });
  })
  .catch((error) => {
    console.log(error);
  });
