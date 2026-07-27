import express from "express";
import { z } from "zod";
import { protect } from "../../middleware/authMiddleware.js";
import { getWishlist, addToWishlist, removeFromWishlist } from "../../controllers/userWishlistController.js";

const router = express.Router();

const addSchema = z.object({
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID"),
});

const removeSchema = z.object({
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID"),
});

router.get("/", protect, getWishlist);

router.post("/add", protect, (req, res, next) => {
  const result = addSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ message: result.error.errors[0].message });
  next();
}, addToWishlist);

router.delete("/:productId", protect, (req, res, next) => {
  const result = removeSchema.safeParse(req.params);
  if (!result.success) return res.status(400).json({ message: result.error.errors[0].message });
  next();
}, removeFromWishlist);

export default router;
