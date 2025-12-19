import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

const router = express.Router();

router.use(protect, admin);

router.get("/stats", async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const productsCount = await Product.countDocuments();
    const ordersCount = await Order.countDocuments();
    const totalSalesAgg = await Order.aggregate([{ $group: { _id: null, total: { $sum: "$totalPrice" } } }]);
    const totalSales = totalSalesAgg[0]?.total || 0;

    res.json({ usersCount, productsCount, ordersCount, totalSales });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
