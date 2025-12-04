import express from "express";
import { addToCart, getCart, removeFromCart, updateQty, clearCart } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getCart);

router.post("/add", protect, addToCart);

router.delete("/:productId", protect, removeFromCart);

router.put("/:productId", protect, updateQty);

router.delete("/remove/:id", protect, clearCart);

export default router;
