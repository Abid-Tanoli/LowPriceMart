import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const getStats = async (req, res) => {
  const usersCount = await User.countDocuments();
  const productsCount = await Product.countDocuments();
  const ordersCount = await Order.countDocuments();

  res.json({ usersCount, productsCount, ordersCount });
};
