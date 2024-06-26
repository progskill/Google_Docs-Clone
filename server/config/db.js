// server

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
MONGO_URI = "";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected Successfully...");
  } catch (errors) {
    console.log("Failed to connect MongoDB...");
    console.log(errors.message);
    process.exit(1);
  }
};

module.exports = connectDB;
