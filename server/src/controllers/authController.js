const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

function ensureJwtConfigured(res) {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    console.error("JWT_SECRET is missing or too short in server/.env (minimum 32 characters).");
    res.status(500).json({ success: false, message: "Authentication is not configured correctly." });
    return false;
  }
  return true;
}

function issueToken(user) {
  return jwt.sign(
    { sub: String(user._id), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "4h", algorithm: "HS256" }
  );
}

function publicUser(user) {
  return { id: String(user._id), name: user.name, email: user.email, role: user.role };
}

// Public registration always creates a customer. Never accept role from request body.
const register = asyncHandler(async (req, res) => {
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Name, email, and password are required." });
  }
  if (name.length > 100) {
    return res.status(400).json({ success: false, message: "Name must be 100 characters or fewer." });
  }
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254) {
    return res.status(400).json({ success: false, message: "Enter a valid email address." });
  }
  if (password.length < 8 || password.length > 72) {
    return res.status(400).json({ success: false, message: "Password must be between 8 and 72 characters." });
  }
  if (!ensureJwtConfigured(res)) return;

  const existing = await User.findOne({ email }).select("_id").lean();
  if (existing) {
    return res.status(409).json({ success: false, message: "An account with this email already exists. Please sign in." });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  let user;
  try {
    user = await User.create({ name, email, passwordHash, role: "customer", isActive: true });
  } catch (error) {
    // Handle a duplicate email created concurrently.
    if (error?.code === 11000) {
      return res.status(409).json({ success: false, message: "An account with this email already exists. Please sign in." });
    }
    throw error;
  }

  return res.status(201).json({ success: true, token: issueToken(user), user: publicUser(user) });
});

// Login supports both roles; each UI checks the returned role and admin APIs still enforce it server-side.
const login = asyncHandler(async (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ success: false, message: "Enter a valid email address." });
  }
  if (!ensureJwtConfigured(res)) return;

  const user = await User.findOne({ email }).select("+passwordHash");
  const passwordMatches = user ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!user || !passwordMatches || !user.isActive) {
    return res.status(401).json({ success: false, message: "Invalid email or password." });
  }

  return res.json({ success: true, token: issueToken(user), user: publicUser(user) });
});

const me = asyncHandler(async (req, res) => {
  return res.json({ success: true, user: publicUser(req.user) });
});

module.exports = { register, login, me };
