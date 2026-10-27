const Gift = require("../models/Gift");
const asyncHandler = require("../middleware/asyncHandler");

const getGifts = asyncHandler(async (req, res) => {
  const gifts = await Gift.find({ isActive: { $ne: false } }).sort({ createdAt: 1, id: 1 }).lean();
  res.json({ success: true, gifts });
});

module.exports = { getGifts };
