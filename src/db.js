const mongoose = require("mongoose");
const dns = require("dns").promises;

async function connectDB(mongoUri, maxRetries = 20) {
  if (!mongoUri) throw new Error("MONGODB_URI is missing. Check your .env file.");

  // Disconnect any existing connections first
  if (mongoose.connection.readyState !== 0) {
    console.log("Clearing existing MongoDB connection...");
    await mongoose.disconnect();
  }

  mongoose.set("strictQuery", true);

  // Warm up DNS resolver (sometimes helps on fresh restarts)
  try {
    await dns.resolve4("mongodb.net");
    console.log("DNS resolver warmed up");
  } catch (e) {
    console.warn("DNS warmup failed (non-critical):", e.message);
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4,
        autoSelectFamily: false,
      });
      console.log("MongoDB connected successfully");
      return;
    } catch (error) {
      const isLastAttempt = attempt === maxRetries;
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 30000);

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