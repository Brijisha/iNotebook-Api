const mongoose = require("mongoose");

const mongoUrl = "mongodb://localhost:27017/";

const conectToMongo = () => {
  mongoose.connect(mongoUrl, () => {
    console.log("Connected to mongo successfully.");
  });
};

module.exports = conectToMongo;
