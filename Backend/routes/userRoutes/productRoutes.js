import express from "express";
import {
  getProducts,
  getProductById,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../controllers/userProductController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/related/:id", getRelatedProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;