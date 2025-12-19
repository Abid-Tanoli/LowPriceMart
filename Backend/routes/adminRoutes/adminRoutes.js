import express from "express";
import { protect } from "../../../admin/middleware/authMiddleware.js";
import { admin } from "../../../admin/middleware/adminMiddleware.js";
import { getAllUsers, getAllOrders, deleteProduct } from "../../controllers/adminControllers/adminController.js";

const router = express.Router();

router.use(protect, admin);

router.get("/users", getAllUsers);
router.get("/orders", getAllOrders);
router.delete("/product/:id", deleteProduct);

export default router;
