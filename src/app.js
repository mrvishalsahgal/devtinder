const express = require("express");
const app = express();
const connectDB = require("./config/database");
const authRouter = require("./router/auth");
const profileRouter = require("./router/profile");
const requestRouter = require("./router/request");

const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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
