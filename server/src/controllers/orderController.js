const crypto = require("crypto");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const Gift = require("../models/Gift");
const City = require("../models/City");
const Order = require("../models/Order");
const asyncHandler = require("../middleware/asyncHandler");

const TAX_RATE = 0.05;
const DELIVERY_FREE_THRESHOLD = 500;
const DELIVERY_FEE = 50;

async function findCatalogItem(rawId) {
  const id = String(rawId || "").trim();
  if (!id) return null;

  // BakeryContext normalizes item.id from MongoDB _id first, but stable p1/g1
  // string IDs are also accepted to keep the API tolerant of either format.
  if (mongoose.isValidObjectId(id)) {
    const productByObjectId = await Product.findById(id).lean();
    if (productByObjectId) return { item: productByObjectId, itemType: "product" };
    const giftByObjectId = await Gift.findById(id).lean();
    if (giftByObjectId) return { item: giftByObjectId, itemType: "gift" };
  }

  const product = await Product.findOne({ id, isActive: { $ne: false } }).lean();
  if (product) return { item: product, itemType: "product" };
  const gift = await Gift.findOne({ id, isActive: { $ne: false } }).lean();
  if (gift) return { item: gift, itemType: "gift" };
  return null;
}

const createOrder = asyncHandler(async (req, res) => {
  const cityName = String(req.body?.city || "").trim();
  const requestedItems = req.body?.items;

  if (!cityName) {
    return res.status(400).json({ success: false, message: "Select a delivery city before checkout." });
  }
  if (!Array.isArray(requestedItems) || requestedItems.length === 0) {
    return res.status(400).json({ success: false, message: "Your order must contain at least one item." });
  }
  if (requestedItems.length > 100) {
    return res.status(400).json({ success: false, message: "Too many different items in one order." });
  }

  const city = await City.findOne({ name: cityName, isActive: { $ne: false } }).lean();
  if (!city) {
    return res.status(400).json({ success: false, message: "That delivery city is not available. Refresh the city list and try again." });
  }

  const items = [];
  for (const requested of requestedItems) {
    const quantity = Number(requested?.quantity);
    const identifier = requested?.productId ?? requested?.id;

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      return res.status(400).json({ success: false, message: "Each item quantity must be a whole number between 1 and 99." });
    }

    const resolved = await findCatalogItem(identifier);
    if (!resolved) {
      return res.status(400).json({ success: false, message: `An item in your cart is no longer available (${String(identifier || "unknown item")}). Refresh the menu and try again.` });
    }

    const { item, itemType } = resolved;
    const price = Number(item.price);
    if (!Number.isFinite(price) || price < 0) {
      return res.status(400).json({ success: false, message: `Price is invalid for ${item.name}.` });
    }

    items.push({
      catalogId: String(item.id || item._id),
      itemType,
      name: item.name,
      price,
      quantity,
      lineTotal: price * quantity,
      image: item.image || item.imageUrl || "",
    });
  }

  // Never trust totals supplied by the browser; calculate them from DB prices.
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const delivery = subtotal === 0 || subtotal >= DELIVERY_FREE_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + tax + delivery;
  const orderNumber = `THO-${Date.now()}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;

  const order = await Order.create({
    orderNumber,
    city: cityName,
    items,
    subtotal,
    tax,
    delivery,
    total,
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "not_selected",
  });

  return res.status(201).json({
    success: true,
    message: `Order ${order.orderNumber} created successfully. Payment is not connected yet.`,
    order: {
      _id: order._id,
      orderNumber: order.orderNumber,
      city: order.city,
      items: order.items,
      subtotal: order.subtotal,
      tax: order.tax,
      delivery: order.delivery,
      total: order.total,
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
    },
  });
});

module.exports = { createOrder };
