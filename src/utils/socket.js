const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const ConnectionRequestModel = require("../models/connectionRequest");

const getSecretRoomId = ({ userId, targetUserId }) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    // Handle events
    socket.on("joinChat", ({ userId, targetUserId }) => {
      const room = getSecretRoomId({ userId, targetUserId });

      socket.join(room);
    });

    socket.on(
      "sendMessage",
      async ({ userId, targetUserId, firstName, lastName, text }) => {
        try {
          const room = getSecretRoomId({ userId, targetUserId });
          const isConnection = await ConnectionRequestModel.findOne({
            $or: [
              {
                fromUserId: targetUserId,
                toUserId: userId,
                status: "accepted",
              },
              {
                toUserId: targetUserId,
                fromUserId: userId,
                status: "accepted",
              },
            ],
          });

          console.log(isConnection);

          if (!isConnection) {
            throw new Error("Target user is not your connection");
          }

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();

          // all the people in room will recieve
          io.to(room).emit("messageRecieved", { firstName, lastName, text });
        } catch (err) {
          console.error(err);
        }
      }
    );
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
