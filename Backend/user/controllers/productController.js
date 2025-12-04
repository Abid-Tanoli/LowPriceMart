import { paginate } from "../helpers/pagination.js";
import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;

    const query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" }; 
    }

    const result = await paginate(Product, query, {
      page,
      limit,
      sort: { createdAt: -1 },
      select: "name price category image description stock",
    });

    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching products:", err.message);
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

export const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    })
      .limit(5)
      .select("name price category image description stock");

    res.status(200).json(related);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    const product = new Product({ name, description, price, category, image, stock });
    const savedProduct = await product.save();

    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    Object.assign(product, req.body);
    const updated = await product.save();

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};