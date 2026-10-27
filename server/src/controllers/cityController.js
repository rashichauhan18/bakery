const City = require("../models/City");
const asyncHandler = require("../middleware/asyncHandler");

const getCities = asyncHandler(async (req, res) => {
  const cities = await City.find({ isActive: { $ne: false } }).sort({ name: 1 }).lean();
  res.json({ success: true, cities });
});

module.exports = { getCities };
