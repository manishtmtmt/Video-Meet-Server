const mediasoupServer = require("./mediasoup-server");

function socketMain(io) {
  io.on("connection", (socket) => {
    console.log(`⚡ ${socket.id} user connected!`);

    socket.on("disconnect", () => {
      console.log("🔥 User disconnected");
    });
  });

  mediasoupServer(io);
}

module.exports = socketMain;
