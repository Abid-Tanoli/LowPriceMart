import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { PAGINATION_DEFAULTS } from "../config/constants.js";
import logger from "../utils/logger.js";

// ================= DASHBOARD =================
export const getDashboardStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const orders = await Order.countDocuments();
    const products = await Product.countDocuments();

    res.json({ users, orders, products });
  } catch (error) {
    logger.error("Dashboard stats failed:", error);
    res.status(500).json({ message: "Dashboard stats failed" });
  }
};

// ================= USERS =================

// Get all users (non-paginated)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    logger.error("Failed to fetch users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Get paginated users
export const getPaginatedUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || PAGINATION_DEFAULTS.PAGE;
    const limit = parseInt(req.query.limit) || PAGINATION_DEFAULTS.LIMIT;
    const search = req.query.search || "";

    const filter = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalUsers: total,
    });
  } catch (error) {
    logger.error("Failed to fetch users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// ================= ORDERS =================

// Get all orders (non-paginated)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    logger.error("Failed to fetch orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Get paginated orders
export const getPaginatedOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || PAGINATION_DEFAULTS.PAGE;
    const limit = parseInt(req.query.limit) || PAGINATION_DEFAULTS.LIMIT;
    const search = req.query.search || "";

    const filter = search
      ? { _id: { $regex: search, $options: "i" } }
      : {};

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate("user", "name email")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalOrders: total,
    });
  } catch (error) {
    logger.error("Failed to fetch orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// ================= PRODUCTS =================

// Get all products (non-paginated)
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    logger.error("Failed to fetch products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    logger.error("Failed to fetch product:", error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

// Create product
export const createProduct = async (req, res) => {
  try {
    let imageUrl = req.body.image || "";

    if (req.file?.path) {
      imageUrl = req.file.path;
    }

    const { name, description, price, category, stock } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      image: imageUrl,
    });

    res.status(201).json(product);
  } catch (error) {
    logger.error("Failed to create product:", error);
    res.status(500).json({ message: "Failed to create product" });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (req.file?.path) {
      product.image = req.file.path;
    }

    Object.assign(product, req.body);
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    logger.error("Failed to update product:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (error) {
    logger.error("Failed to delete product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

// Get paginated products
export const getPaginatedProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || PAGINATION_DEFAULTS.PAGE;
    const limit = parseInt(req.query.limit) || PAGINATION_DEFAULTS.LIMIT;
    const search = req.query.search || "";

    const filter = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalProducts: total,
    });
  } catch (error) {
    logger.error("Failed to fetch products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};
