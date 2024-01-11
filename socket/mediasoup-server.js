const videoConference = require("./video-conference")

function mediasoupServer(io) {
    videoConference(io)
}

module.exports = mediasoupServer;