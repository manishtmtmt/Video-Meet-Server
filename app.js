const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const connection = require("./config");
const socketMain = require("./socket");
const authRouter = require("./router/auth.router");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

app.get("/", (req, res) => {
  res.send("webrtc server running");
});

app.use("/api", authRouter);

server.listen(8080, async () => {
  try {
    await connection;
    console.log("Mongodb connected!");
  } catch (error) {
    console.log("Mongodb connection err:", err);
  }
  console.log("Server is running on port: 8080");
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

socketMain(io);
