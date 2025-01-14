const express = require("express");
const validator = require("validator");
const bcrypt = require("bcrypt");

const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    return res.send(user);
  } catch (err) {
    res.status(400).send("Error getting user profile: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request");
    }

    const user = req.user;

    Object.keys(req.body).forEach((key) => {
      user[key] = req.body[key];
    });

    await user.save();
    res.json({
      message: "User profile updated successfully",
      data: user,
    });
  } catch (err) {
    res.status(400).send("Error updating user profile: " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { oldPassword, newPassword } = req.body;

    const isPasswordMatch = await user.validatePassword(oldPassword);
    if (!isPasswordMatch) {
      throw new Error("Invalid old password");
    }

    if (oldPassword === newPassword) {
      throw new Error("New password cannot be same as old password");
    }

    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("Password is not strong enough");
    }

    const passwordHash = await bcrypt.hash(newPassword, 10).then((hash) => {
      return hash;
    });

    user.password = passwordHash;
    await user.save();
    res.send("Password updated successfully");
  } catch (err) {
    res.status(400).send("Error updating password: " + err.message);
  }
});

module.exports = profileRouter;
