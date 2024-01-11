const { connect } = require("mongoose");

const connection = connect("mongodb://localhost:27017/meet");

module.exports = connection;
