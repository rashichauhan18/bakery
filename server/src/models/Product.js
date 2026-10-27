const mongoose = require("mongoose");

// Field names intentionally match the existing frontend product cards.
const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    tag: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    eggless: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },
    portion: { type: String, default: "" },
    desc: { type: String, default: "" },
    image: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, id: false }
);

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);
