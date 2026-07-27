import express from "express";
import { protect, admin } from "../../middleware/authMiddleware.js";
import { upload } from "../../middleware/upload.js";
import { validate, productSchemas } from "../../middleware/validate.js";
import {
  getDashboardStats,
  getAllUsers,
  getAllOrders,
  getAllProducts,
  getPaginatedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../controllers/adminController.js";

const router = express.Router();

router.get("/dashboard-stats", protect, admin, getDashboardStats);

router.get("/users", protect, admin, getAllUsers);

router.get("/orders", protect, admin, getAllOrders);

router.get("/products", protect, admin, getAllProducts);
router.get("/products/paginated", protect, admin, getPaginatedProducts);
router.get("/product/:id", protect, admin, getProductById);
router.post("/product", protect, admin, upload.single("image"), validate(productSchemas.create), createProduct);
router.put("/product/:id", protect, admin, upload.single("image"), validate(productSchemas.update), updateProduct);
router.delete("/product/:id", protect, admin, deleteProduct);

export default router;
