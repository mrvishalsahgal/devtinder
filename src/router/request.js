const { userAuth } = require("../middleware/auth");

const express = require("express");
const requestRouter = express.Router();

requestRouter.get("/connections", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user.firstName + " sent a connection request");
});

module.exports = requestRouter;
