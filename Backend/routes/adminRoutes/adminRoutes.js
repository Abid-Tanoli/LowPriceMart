import express from "express";
import { admin} from "../../middleware/adminMiddleware.js";
import { protect } from "../../middleware/authMiddleware.js";
import { getAllUsers, getAllOrders, deleteProduct } from "../../controllers/adminController.js";

const router = express.Router();

router.use(admin);

router.get("/users", protect, admin, getAllUsers);
router.get("/orders", protect, admin, getAllOrders);
router.delete("/product/:id", protect, admin, deleteProduct);

export default router;
