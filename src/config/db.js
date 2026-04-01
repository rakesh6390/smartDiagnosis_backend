const mongoose = require("mongoose");

const { env } = require("./env");
const { logger } = require("../utils/logger");

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  // Major step: connect to MongoDB with sensible defaults.
  mongoose.set("strictQuery", true);

  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10_000
  });

  isConnected = true;
  logger.info("Connected to MongoDB");
}

module.exports = { connectDB };

