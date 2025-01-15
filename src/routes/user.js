const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");

const userRouter = express.Router();

const USER_SAFE_DATA = ["firstName", "lastName", "emailId"];

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const user = req.user;

    const requests = await ConnectionRequestModel.find({
      toUserId: user._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    if (!requests) {
      throw new Error("Requests not found");
    }

    res.send({
      message: "User requests fetched successfully",
      data: requests,
    });
  } catch (err) {
    res.status(400).send("Error getting user requests: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const user = req.user;

    const requests = await ConnectionRequestModel.find({
      $or: [
        {
          toUserId: user._id,
          status: "accepted",
        },
        {
          fromUserId: user._id,
          status: "accepted",
        },
      ],
    })
      .populate("toUserId", USER_SAFE_DATA)
      .populate("fromUserId", USER_SAFE_DATA);

    const data = requests.map((request) => {
      if (request.fromUserId._id.equals(user._id)) {
        return request.toUserId;
      }

      return request.fromUserId;
    });

    res.send({
      message: "User connections fetched successfully",
      data: data,
    });
  } catch (err) {
    res.status(400).send("Error getting user connections: " + err.message);
  }
});

module.exports = userRouter;
