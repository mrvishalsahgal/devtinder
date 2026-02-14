const { userAuth } = require("../middleware/auth");
const { profileValidate } = require("../utils/validate");

const express = require("express");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user);
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    profileValidate(req);
    if (!profileValidate) {
      throw new Error("Invalid fields");
    }
    const user = req.user;
    Object.keys(req.body).forEach((key) => {
      user[key] = req.body[key];
    });
    await user.save();
    res.json({ message: "Profile updated successfully", data: user });
  } catch (error) {
    res.status(500).send("ERROR: " + error.message);
  }
});

module.exports = profileRouter;
