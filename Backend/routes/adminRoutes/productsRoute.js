import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
} from "../../user/controllers/adminControllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(protect, admin);

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
