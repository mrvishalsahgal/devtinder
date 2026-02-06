const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://namastenode:42KH6QJdMANre4Ku@namastenode.8ryfvxb.mongodb.net/devTinder",
  );
};

module.exports = connectDB;
