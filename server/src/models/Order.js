const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    catalogId: { type: String, required: true },
    itemType: { type: String, enum: ["product", "gift"], required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true, min: 0 },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    city: { type: String, required: true, trim: true },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: { validator: (items) => Array.isArray(items) && items.length > 0, message: "An order must have at least one item." },
    },
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, required: true, min: 0 },
    delivery: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"], default: "pending" },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
    paymentMethod: { type: String, default: "not_selected" },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
