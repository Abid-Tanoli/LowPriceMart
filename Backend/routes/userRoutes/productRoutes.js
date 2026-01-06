// backend/routes/userRoutes/productRoutes.js
import express from "express";
import {
  getAllProducts,
  getProductById,
} from "../../controllers/userProductController.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);

export default router;
