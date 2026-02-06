const express = require("express");
const app = express();
const connectDB = require("./config/database");
const { adminAuth, userAuth } = require("./middleware/auth");
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send("User created successfully");
  } catch (error) {
    res.status(500).send(error);
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

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const allowedUpdates = ["age", "gender", "skills", "userId"];
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
