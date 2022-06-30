const mongoose = require("mongoose");

const mongoUrl =
  "mongodb+srv://brijisha:brinak@brijisha.pr3fa.mongodb.net/inotebook";

const conectToMongo = () => {
  mongoose.connect(mongoUrl, () => {
    console.log("Connected to mongo successfully.");
  });
};

module.exports = conectToMongo;
