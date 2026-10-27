const mongoose = require("mongoose");

// Field names intentionally match GiftingSection.jsx.
const giftSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: "" },
    desc: { type: String, default: "" },
    category: { type: String, default: "gifting" },
    tag: { type: String, default: "Gift Ready" },
    eggless: { type: Boolean, default: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },
    portion: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, id: false }
);

module.exports = mongoose.models.Gift || mongoose.model("Gift", giftSchema);
