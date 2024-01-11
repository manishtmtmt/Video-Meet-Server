const { connect } = require("mongoose");

const connection = connect(
  "mongodb+srv://manishtmtmt:admin@cluster0.dhuzq3p.mongodb.net/video-meet?retryWrites=true&w=majority"
);

module.exports = connection;
