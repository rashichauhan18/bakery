require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const giftRoutes = require("./routes/giftRoutes");
const cityRoutes = require("./routes/cityRoutes");
const orderRoutes = require("./routes/orderRoutes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "100kb" }));

app.get("/", (req, res) => {
  res.json({ success: true, message: "Bakery API is running. Use /api/health." });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Bakery API is running!",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.use("/api/products", productRoutes);
app.use("/api/gifts", giftRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/orders", orderRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Backend startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
