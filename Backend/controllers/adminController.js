import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const getAllUsers = async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json(users);
};

export const getAllOrders = async (req, res) => {
  const orders = await Order.find({}).populate("user", "name email");
  res.json(orders);
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  await product.deleteOne();
  res.json({ message: "Product removed" });
};
