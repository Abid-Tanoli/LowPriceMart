import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateQty,
  clearCart,
} from "../../controllers/userCartController.js";
import { protect } from "../../middleware/authMiddleware.js";
import { validate, cartSchemas } from "../../middleware/validate.js";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/add", protect, validate(cartSchemas.addItem), addToCart);
router.delete("/clear", protect, clearCart);
router.put("/:productId", protect, validate(cartSchemas.updateQty), updateQty);
router.delete("/:productId", protect, removeFromCart);

export default router;
