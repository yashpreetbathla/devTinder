const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestsRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);

app.get("/user", async (req, res) => {
  try {
    const userEmail = req.body.emailId;
    const user = await User.findOne({ emailId: userEmail });

    if (!user) {
      throw new Error("User not found");
    }

    res.send(user);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});

    res.send(users);
  } catch (err) {
    res.status(500).send("Error getting users: " + err.message);
  }
});

app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.id;
    const user = await User.findByIdAndDelete(userId);
    if (user) {
      res.send("User deleted successfully");
    } else {
      throw new Error("User not found");
    }
  } catch (err) {
    res.status(404).send("Error deleting user: " + err.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req.params?.userId;
    const userObj = req.body;

    const ALLOWED_UPDATES = [
      "photoUrl",
      "about",
      "skills",
      "gender",
      "age",
      "password",
    ];

    const isUpdateAllowed = Object.keys(userObj).every((update) =>
      ALLOWED_UPDATES.includes(update)
    );

    if (!isUpdateAllowed) {
      throw new Error("Field update not allowed");
    }

    const user = await User.findOneAndUpdate({ _id: userId }, userObj, {
      runValidators: true,
    });
    if (!user) {
      throw new Error("User not found");
    }
    res.send("User data updated successfully");
  } catch (err) {
    res.status(400).send("Error updating user: " + err.message);
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
