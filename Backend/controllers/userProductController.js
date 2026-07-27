import { paginate } from "../helpers/pagination.js";
import Product from "../models/Product.js";
import { PAGINATION_DEFAULTS } from "../config/constants.js";
import logger from "../utils/logger.js";

export const getAllProducts = async (req, res) => {
  try {
    const { page = PAGINATION_DEFAULTS.PAGE, limit = PAGINATION_DEFAULTS.LIMIT, category, search } = req.query;

    const query = {};
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const result = await paginate(Product, query, {
      page,
      limit,
      sort: { createdAt: -1 },
      select: "name price category image description stock rating numReviews",
    });

    res.status(200).json(result);
  } catch (err) {
    logger.error("Error fetching products:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length === 0) {
      return res.json([]);
    }

    const suggestions = await Product.find({
      $or: [
        { name: { $regex: q.trim(), $options: "i" } },
        { description: { $regex: q.trim(), $options: "i" } },
      ],
    })
      .select("name image price")
      .limit(8)
      .lean();

    res.json(suggestions);
  } catch (err) {
    logger.error("Error fetching search suggestions:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) {
      return res.status(400).json({ message: "You already reviewed this product" });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } catch (err) {
    logger.error("Error creating review:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const related = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
    })
      .select("name price category image description stock rating numReviews")
      .limit(6)
      .sort({ createdAt: -1 });

    res.status(200).json(related);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
