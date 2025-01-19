const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://namastedev:Ed1xPYX0q9JBQfke@namastenode.5uffz.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
