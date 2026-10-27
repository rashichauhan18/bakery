const express = require("express");
const {
  getProducts,
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { authenticate, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// Public catalog remains compatible with the existing storefront.
router.get("/", getProducts);
// Admin-only list includes every product, including inactive products.
router.get("/admin/all", authenticate, requireAdmin, getAdminProducts);
router.get("/:id", getProductById);
router.post("/", authenticate, requireAdmin, createProduct);
router.put("/:id", authenticate, requireAdmin, updateProduct);
router.delete("/:id", authenticate, requireAdmin, deleteProduct);

module.exports = router;
