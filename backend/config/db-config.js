const mongoose = require("mongoose");
require("dotenv").config();

// Reuse the connection (or in-flight connection attempt) across warm
// serverless invocations instead of reconnecting on every request.
let connectionPromise = null;

const connectDB = () => {
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve();
  }
  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGODB_URL)
      .then(() => {
        console.log("MongoDB connected successfully");
      })
      .catch((error) => {
        connectionPromise = null;
        console.error("Error connecting to MongoDB:", error);
        throw error;
      });
  }
  return connectionPromise;
};

// Function to disconnect from MongoDB
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected successfully");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
  }
};

// Correctly exporting connectDB and disconnectDB as an object
module.exports = { connectDB, disconnectDB };
