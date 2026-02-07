const express = require("express");
const app = express();
const connectDB = require("./config/database");
const { adminAuth, userAuth } = require("./middleware/auth");
const User = require("./models/user");
const { validatorSignup } = require("./utils/validate");
const bcrypt = require("bcrypt");

app.use(express.json());

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
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("invalid crendiatials");
    }
    res.send("user logged in successfully");
  } catch (error) {
    res.status(500).send("ERROR: " + error.message);
  }
});

// Get user by email
app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

//feed find will give in array
app.get("/feed", async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findById(req.body);
    if (user.length === 0) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const allowedUpdates = ["age", "gender", "skills"];
    const updates = Object.keys(req.body);
    const isValidUpdate = updates.every((update) =>
      allowedUpdates.includes(update),
    );
    if (!isValidUpdate) {
      return res.status(400).send("Invalid update");
    }

    const user = await User.findByIdAndUpdate(userId, req.body, {
      returnDocument: "before",
      runValidators: true,
    });
    console.log(user);
    res.send("User updated successfully");
  } catch (error) {
    res.status(500).send(error);
  }
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
