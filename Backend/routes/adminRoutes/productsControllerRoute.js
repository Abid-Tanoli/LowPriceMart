import express from "express";
import { upload } from "../../middleware/upload.js";
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductById,
} from "../../controllers/userProductController.js";
import { protect } from "../../middleware/authMiddleware.js";
import { admin } from "../../middleware/adminMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(admin);

router.post("/product", upload.single("image"), createProduct);   
router.get("/products", getAllProducts);                          
router.get("/product/:id", getProductById);                       
router.put("/product/:id", upload.single("image"), updateProduct);
router.delete("/product/:id", deleteProduct);                      

export default router;
