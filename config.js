require("dotenv").config();
const { connect } = require("mongoose");

const mongodb_uri = process.env.MONGODB_URI || "mongodb://localhost:27017/meet";

const connection = connect(
  "mongodb+srv://manishtmtmt:admin@cluster0.dhuzq3p.mongodb.net/video-meet?retryWrites=true&w=majority"
);

module.exports = connection;
