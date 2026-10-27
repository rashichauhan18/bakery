const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri === "PASTE_YOUR_MONGODB_ATLAS_CONNECTION_STRING_HERE") {
    throw new Error("MONGODB_URI is missing from server/.env");
  }

  const connection = await mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB_NAME || "bakery",
    serverSelectionTimeoutMS: 10000,
  });

  console.log(`MongoDB connected: ${connection.connection.host}`);
  console.log(`Database: ${connection.connection.name}`);
  return connection;
}

module.exports = connectDB;
