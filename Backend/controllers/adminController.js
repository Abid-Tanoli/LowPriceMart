import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// ================= DASHBOARD =================
export const getDashboardStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const orders = await Order.countDocuments();
    const products = await Product.countDocuments();

    res.json({ users, orders, products });
  } catch (error) {
    res.status(500).json({ message: "Dashboard stats failed" });
  }
};

// ================= USERS =================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// ================= ORDERS =================
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// ================= PRODUCTS =================

// Get all products (non-paginated)
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch {
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

// Create product
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch {
    res.status(500).json({ message: "Failed to create product" });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch {
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
  } catch {
    res.status(500).json({ message: "Failed to delete product" });
  }
};

// ================= PAGINATED PRODUCTS =================
export const getPaginatedProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;      // Current page
    const limit = parseInt(req.query.limit) || 10;   // Items per page
    const search = req.query.search || "";

    // Filter for search
    const filter = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalPages = Math.ceil(total / limit);

    res.json({
      products,
      totalPages,
      currentPage: page,
      totalProducts: total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
