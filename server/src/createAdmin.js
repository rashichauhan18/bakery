require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");

async function createAdmin() {
  const email = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = String(process.env.ADMIN_PASSWORD || "");

  if (!email || !/^\S+@\S+\.\S+$/.test(email) || email === "admin@example.com") {
    throw new Error("Set a real ADMIN_EMAIL in your private server/.env before running npm run create-admin.");
  }
  if (!password || password.startsWith("REPLACE_WITH_") || password.length < 12) {
    throw new Error("Set a strong ADMIN_PASSWORD of at least 12 characters in your private server/.env.");
  }
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET.startsWith("REPLACE_WITH_")) {
    throw new Error("Set JWT_SECRET to a random secret of at least 32 characters in server/.env.");
  }

  await connectDB();
  const existing = await User.findOne({ email });
  if (existing) {
    if (existing.role !== "admin") {
      throw new Error("That email is already used by a non-admin account. Use a different ADMIN_EMAIL.");
    }
    console.log(`Admin account ${email} already exists; no changes made.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await User.create({ name: "Bakery Admin", email, passwordHash, role: "admin", isActive: true });
  console.log(`Admin account created for ${email}. The password is stored as a bcrypt hash.`);
}

createAdmin()
  .catch((error) => {
    console.error("Could not create admin:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close().catch(() => {});
  });
