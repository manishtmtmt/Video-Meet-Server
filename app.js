require("dotenv").config();
const express = require("express");
const https = require("httpolyglot");
const fs = require("fs");
const { Server } = require("socket.io");
const cors = require("cors");

const connection = require("./config");
const socketMain = require("./socket");
const authRouter = require("./router/auth.router");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const options = {
  key: fs.readFileSync("./ssl/key.pem", "utf-8"),
  cert: fs.readFileSync("./ssl/cert.pem", "utf-8"),
};

app.get("/", (req, res) => {
  res.send("Welcome to video meet server.");
});

app.use("/api", authRouter);

const server = https.createServer(options, app);
const port = process.env.PORT || 8000;

server.listen(port, async () => {
  try {
    await connection;
    console.log("Mongodb connected!");
  } catch (error) {
    console.log("Mongodb connection err:", error);
  }
  console.log(`Server is running on port: ${port}`);
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

socketMain(io);