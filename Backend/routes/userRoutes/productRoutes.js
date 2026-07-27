import express from "express";
import { z } from "zod";
import { protect } from "../../middleware/authMiddleware.js";
import {
  getAllProducts,
  getProductById,
  getRelatedProducts,
  getSearchSuggestions,
  createReview,
} from "../../controllers/userProductController.js";

const router = express.Router();

const reviewSchema = z.object({
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  comment: z.string().min(10, "Comment must be at least 10 characters").max(500, "Comment must be at most 500 characters"),
});

router.get("/", getAllProducts);
router.get("/search-suggestions", getSearchSuggestions);
router.get("/related/:id", getRelatedProducts);

router.post("/:id/reviews", protect, (req, res, next) => {
  const result = reviewSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ message: result.error.errors[0].message });
  req.body = result.data;
  next();
}, createReview);

router.get("/:id", getProductById);

export default router;
