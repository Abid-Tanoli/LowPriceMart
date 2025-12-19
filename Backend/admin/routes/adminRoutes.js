import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";
import { getAllUsers, getAllOrders, deleteProduct } from "../controllers/adminController.js";

const router = express.Router();

router.use(protect, admin);

router.get("/users", getAllUsers);
router.get("/orders", getAllOrders);
router.delete("/product/:id", deleteProduct);

export default router;
