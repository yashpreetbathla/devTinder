const express = require("express");
const bcrypt = require("bcrypt");

const connectDB = require("./config/database");
const User = require("./models/user");

const { validateSignupData, validateLoginData } = require("./utils/validation");

const app = express();
const port = 3000;

app.use(express.json());

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    validateLoginData(req);

    const user = await User.findOne({ emailId });

    if (user) {
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      // Password check
      if (!isPasswordMatch) {
        throw new Error("Invalid credentials!");
      }

      res.send("User logged in successfully");
    } else {
      throw new Error("Invalid credentials!");
    }
  } catch (err) {
    res.status(400).send("Error logging in: " + err.message);
  }
});

app.post("/signup", async (req, res) => {
  try {
    // Validating the request body
    validateSignupData(req);

    const { password } = req.body;

    // Encrypting the password
    const passwordHash = await bcrypt.hash(password, 10).then((hash) => {
      return hash;
    });

    const userObj = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailId: req.body.emailId,
      password: passwordHash,
      age: req.body.age,
      gender: req.body.gender,
    };

    // Creating an instance of User model
    const user = new User(userObj);

    await user.save();

    res.send("User created successfully");
  } catch (err) {
    res.status(400).send("Error creating user: " + err.message);
  }
});

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
