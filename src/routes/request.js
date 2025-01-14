const express = require("express");
const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.get("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;

  res.send(user.firstName + "sent the connect request");
});

module.exports = requestRouter;
