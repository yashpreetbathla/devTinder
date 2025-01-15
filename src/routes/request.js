const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const status = req.params.status; // pending or ignored
      const toUserId = req.params.toUserId;

      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status type: " + status);
      }

      // Check if the user exists
      const toUser = await User.findById(toUserId);

      if (!toUser) {
        throw new Error("User not found");
      }

      // If there is an existing ConnectionRequest
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          {
            fromUserId: user._id,
            toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: user._id,
          },
        ],
      });

      if (existingConnectionRequest) {
        throw new Error("Connection request already exists");
      }

      const newConnectionRequest = new ConnectionRequest({
        fromUserId: user._id,
        toUserId,
        status,
      });

      const data = await newConnectionRequest.save();

      res.json({
        message: "Connection request sent successfully",
        data: data,
      });
    } catch (err) {
      res.status(400).send("Error sending connection request: " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const status = req.params.status; // accepted or rejected
      const requestId = req.params.requestId;

      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status type: " + status);
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: user._id,
        status: "interested",
      });

      if (!connectionRequest) {
        throw new Error("Connection request not found");
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({
        message: "Connection request responded successfully",
        data: data,
      });
    } catch (err) {
      res.status(400).send({
        message: err.message,
      });
    }
  }
);

module.exports = requestRouter;
