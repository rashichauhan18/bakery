const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("./asyncHandler");

const authenticate = asyncHandler(async (req, res, next) => {
  const authorization = req.headers.authorization || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return res.status(401).json({ success: false, message: "Authentication required. Please sign in." });
  }

  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    console.error("JWT_SECRET is missing or too short in server/.env (minimum 32 characters).");
    return res.status(500).json({ success: false, message: "Authentication is not configured correctly." });
  }

  let payload;
  try {
    payload = jwt.verify(match[1], process.env.JWT_SECRET, { algorithms: ["HS256"] });
  } catch {
    return res.status(401).json({ success: false, message: "Your session is invalid or expired. Please sign in again." });
  }

  const user = await User.findById(payload.sub).select("name email role isActive").lean();
  if (!user || !user.isActive) {
    return res.status(401).json({ success: false, message: "This account is unavailable." });
  }
  req.user = user;
  return next();
});

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Administrator access required." });
  }
  return next();
}

module.exports = { authenticate, requireAdmin };
