const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

const USER_SAFE_DATA = [
  "firstName",
  "lastName",
  "emailId",
  "about",
  "gender",
  "age",
  "skills",
  "photoUrl",
];

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

// /user/feed?page=1&limit=10"  or /user/feed"
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const user = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    limit = limit > 100 ? 100 : limit;

    const connections = await ConnectionRequestModel.find({
      // Already made an entry.
      $or: [
        {
          toUserId: user._id,
        },
        {
          fromUserId: user._id,
        },
      ],
    })
      .select("fromUserId toUserId")
      .populate("fromUserId", ["firstName", "lastName", "emailId"])
      .populate("toUserId", ["firstName", "lastName", "emailId"]);

    const requests = await User.find({
      $and: [
        { _id: { $ne: user._id } },
        {
          _id: {
            $nin: connections.map((connection) => {
              if (user._id.equals(connection.fromUserId._id)) {
                return connection.toUserId;
              }
              return connection.fromUserId;
            }),
          },
        },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      message: "User feed fetched successfully",
      data: requests,
    });
  } catch (err) {
    res.status(400).send("Error getting user feed: " + err.message);
  }
});

module.exports = userRouter;
