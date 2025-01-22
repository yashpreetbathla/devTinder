const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

const connectDB = require("./config/database");

require("dotenv").config();
require("./utils/cronjob");

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestsRouter = require("./routes/request");
const userRouter = require("./routes/user");
const initializeSocket = require("./utils/socket");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
app.use("/", userRouter);

const server = http.createServer(app);

initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Database connected");

    server.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database: ", err);
  });
