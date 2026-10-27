const mongoose = require("mongoose");

// LocationModal.jsx and Footer.jsx use name/city/shortName/icon/outlets.
const citySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true, unique: true },
    city: { type: String, default: "", trim: true },
    shortName: { type: String, default: "", trim: true },
    icon: { type: String, default: "📍" },
    outlets: { type: String, default: "Delivery available" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, id: false }
);

module.exports = mongoose.models.City || mongoose.model("City", citySchema);
