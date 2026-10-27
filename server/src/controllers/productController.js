const Product = require("../models/Product");
const asyncHandler = require("../middleware/asyncHandler");

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: { $ne: false } }).sort({ createdAt: 1, id: 1 }).lean();
  res.json({ success: true, products });
});

module.exports = { getProducts };
