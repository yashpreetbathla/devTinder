const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name not valid");
  } else if (firstName.length < 4 || firstName.length > 20) {
    throw new Error("First name should be between 4 to 20 characters");
  } else if (lastName.length < 4 || lastName.length > 20) {
    throw new Error("Last name should be between 4 to 20 characters");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  }
};

const validateLoginData = (req) => {
  const { emailId, password } = req.body;
  if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!password) {
    throw new Error("Password is not valid");
  }
};

module.exports = { validateSignupData, validateLoginData };
