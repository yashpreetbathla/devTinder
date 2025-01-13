const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");
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
  res.send("User Data Sent");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
