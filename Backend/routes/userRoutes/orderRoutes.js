import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
} from "../../controllers/userOrderController.js";
import { protect } from "../../middleware/authMiddleware.js";
import { validate, orderSchemas } from "../../middleware/validate.js";

const router = express.Router();

router.post("/", protect, validate(orderSchemas.create), createOrder);
router.get("/myorders", protect, getUserOrders);
router.get("/:id", protect, getOrderById);

export default router;
