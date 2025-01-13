const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      maxLength: 20,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      maxLength: 20,
    },
    emailId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong enough");
        }
      },
    },
    age: {
      type: Number,
      required: true,
      min: 18,
    },
    gender: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      trim: true,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Photo URL is not valid");
        }
      },
    },
    about: {
      type: String,
      default: "This is default about of the user",
      trim: true,
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 10) {
          throw new Error("Skills can't be more than 10");
        }
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
