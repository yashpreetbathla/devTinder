const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const {
  validateLoginData,
  validateSignupData,
} = require("../utils/validation");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    validateLoginData(req);

    const user = await User.findOne({ emailId });

    if (user) {
      const isPasswordMatch = await user.validatePassword(password);
      // Password check
      if (!isPasswordMatch) {
        throw new Error("Invalid credentials!");
      }
      // Create JWT token
      const token = await user.getJWT();

      // Add the token to cookie and send the response back
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000), // 8 hours
      });
      res.send("User logged in successfully");
    } else {
      throw new Error("Invalid credentials!");
    }
  } catch (err) {
    res.status(400).send("Error logging in: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.send("User logged out successfully");
  } catch (err) {
    res.status(400).send("Error logging out: " + err.message);
  }
});

module.exports = authRouter;
