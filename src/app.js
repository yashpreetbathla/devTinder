const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();
const port = 3000;

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Virat",
    lastName: "Kohli",
    emailId: "Virat@gmail.com",
    password: "password",
    age: 30,
    gender: "Male",
  };

  // Creating an instance of User model
  const user = new User(userObj);

  try {
    await user.save();

    res.send("User created successfully");
  } catch (err) {
    res.status(400).send("Error saving user" + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected");

    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database: ", err);
  });
