const mongoose = require("mongoose");

async function connectDB(mongoUri, maxRetries = 5) {
  if (!mongoUri) throw new Error("MONGODB_URI is missing. Check your .env file.");

  // Disconnect any existing connections first (handles restarts cleanly)
  if (mongoose.connection.readyState !== 0) {
    console.log("Clearing existing MongoDB connection...");
    await mongoose.disconnect();
  }

  mongoose.set("strictQuery", true);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 2,
        family: 4, // Force IPv4 to avoid DNS issues
      });
      console.log("MongoDB connected");
      return;
    } catch (error) {
      const isLastAttempt = attempt === maxRetries;
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 30000); // Exponential backoff, max 30s

      if (isLastAttempt) {
        throw error;
      }

      console.error(
        `MongoDB connection attempt ${attempt}/${maxRetries} failed. Retrying in ${delay}ms...`,
        error.message
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

module.exports = { connectDB };