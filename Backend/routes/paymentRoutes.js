import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  initiateJazzCashPayment,
  jazzCashCallback,
  initiateEasyPaisaPayment,
  easyPaisaCallback,
} from "../controllers/paymentController.js";

const router = express.Router();

// Protected - user initiates payment
router.post("/jazzcash/initiate", protect, initiateJazzCashPayment);
router.post("/easypaisa/initiate", protect, initiateEasyPaisaPayment);

// Public - gateway callbacks (hash verification is the security)
router.post("/jazzcash/callback", jazzCashCallback);
router.post("/easypaisa/callback", easyPaisaCallback);

export default router;
