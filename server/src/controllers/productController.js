const crypto = require("crypto");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const asyncHandler = require("../middleware/asyncHandler");

const EDITABLE_FIELDS = [
  "name", "category", "tag", "price", "eggless", "rating", "reviews", "portion", "desc", "image", "isActive",
];

async function findProduct(identifier) {
  const value = String(identifier || "").trim();
  if (!value) return null;
  if (mongoose.isValidObjectId(value)) {
    const byObjectId = await Product.findById(value);
    if (byObjectId) return byObjectId;
  }
  return Product.findOne({ id: value });
}

function validateProductFields(body, { partial = false } = {}) {
  const errors = [];
  if (!partial || body.name !== undefined) {
    if (typeof body.name !== "string" || !body.name.trim()) errors.push("Name is required.");
    else if (body.name.trim().length > 120) errors.push("Name must be 120 characters or fewer.");
  }
  if (!partial || body.category !== undefined) {
    if (typeof body.category !== "string" || !body.category.trim()) errors.push("Category is required.");
  }
  if (!partial || body.price !== undefined) {
    const price = Number(body.price);
    if (body.price === "" || body.price === undefined || !Number.isFinite(price) || price < 0) errors.push("Price must be a non-negative number.");
  }
  if (body.rating !== undefined && (!Number.isFinite(Number(body.rating)) || Number(body.rating) < 0 || Number(body.rating) > 5)) errors.push("Rating must be between 0 and 5.");
  if (body.reviews !== undefined && (!Number.isInteger(Number(body.reviews)) || Number(body.reviews) < 0)) errors.push("Reviews must be a non-negative whole number.");
  if (body.eggless !== undefined && typeof body.eggless !== "boolean") errors.push("Eggless must be true or false.");
  if (body.isActive !== undefined && typeof body.isActive !== "boolean") errors.push("isActive must be true or false.");
  for (const field of ["tag", "portion", "desc", "image"]) {
    if (body[field] !== undefined && typeof body[field] !== "string") errors.push(`${field} must be a string.`);
  }
  return errors;
}

const getProducts = asyncHandler(async (_req, res) => {
  const products = await Product.find({ isActive: { $ne: false } }).sort({ createdAt: 1, id: 1 }).lean();
  return res.json({ success: true, products });
});

const getAdminProducts = asyncHandler(async (_req, res) => {
  const products = await Product.find({}).sort({ createdAt: 1, id: 1 }).lean();
  return res.json({ success: true, products });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await findProduct(req.params.id);
  if (!product || product.isActive === false) return res.status(404).json({ success: false, message: "Product not found." });
  return res.json({ success: true, product });
});

const createProduct = asyncHandler(async (req, res) => {
  const body = req.body || {};
  const errors = validateProductFields(body);
  if (errors.length) return res.status(400).json({ success: false, message: errors.join(" ") });

  const id = String(body.id || `p-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`).trim();
  if (!id || id.length > 80) return res.status(400).json({ success: false, message: "Product ID must be between 1 and 80 characters." });
  if (await Product.exists({ id })) return res.status(409).json({ success: false, message: `Product ID '${id}' already exists.` });

  const productData = { id };
  for (const field of EDITABLE_FIELDS) if (body[field] !== undefined) productData[field] = body[field];
  productData.name = productData.name.trim();
  productData.category = productData.category.trim();
  productData.price = Number(productData.price);
  if (productData.rating !== undefined) productData.rating = Number(productData.rating);
  if (productData.reviews !== undefined) productData.reviews = Number(productData.reviews);
  if (productData.tag === undefined) productData.tag = "";
  if (productData.desc === undefined) productData.desc = "";
  if (productData.portion === undefined) productData.portion = "";
  if (productData.image === undefined) productData.image = "";
  if (productData.eggless === undefined) productData.eggless = false;
  if (productData.isActive === undefined) productData.isActive = true;

  const product = await Product.create(productData);
  return res.status(201).json({ success: true, message: "Product created.", product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await findProduct(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: "Product not found." });

  const body = req.body || {};
  const errors = validateProductFields(body, { partial: true });
  if (errors.length) return res.status(400).json({ success: false, message: errors.join(" ") });
  for (const field of EDITABLE_FIELDS) {
    if (body[field] !== undefined) {
      product[field] = ["price", "rating", "reviews"].includes(field) ? Number(body[field]) : body[field];
    }
  }
  if (typeof product.name === "string") product.name = product.name.trim();
  if (typeof product.category === "string") product.category = product.category.trim();
  await product.save();
  return res.json({ success: true, message: "Product updated.", product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await findProduct(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: "Product not found." });
  await product.deleteOne();
  return res.json({ success: true, message: "Product deleted.", id: product.id });
});

module.exports = { getProducts, getAdminProducts, getProductById, createProduct, updateProduct, deleteProduct };
