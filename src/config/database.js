const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://<userName>:<pwd>@namastenode.5uffz.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
