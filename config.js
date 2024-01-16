require("dotenv").config();
const { connect } = require("mongoose");

const mongodb_uri =
  process.env.MONGODB_URI || "mongodb://localhost:27017/video-meet";

const connection = connect(mongodb_uri);

module.exports = connection;
