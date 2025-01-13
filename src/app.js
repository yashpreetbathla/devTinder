const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");
const { errorMiddleware } = require("./middlewares/error");
const app = express();
const port = 3000;

app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res, next) => {
  res.send("Admin Data Sent");
});

app.get("/user/login", (req, res) => {
  res.send("User Login Data Sent");
});

app.use("/user", userAuth);

app.get("/user", (req, res) => {
  try {
    res.send("User Data Sent");
  } catch (err) {
    // res.status(500).send("Something went wrong");
    throw new Error("Something went wrong"); // This will be caught by the errorMiddleware
  }
});

app.use("/", errorMiddleware);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
