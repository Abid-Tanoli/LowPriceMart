import express from "express";
import { registerUser, loginUser, getProfile } from "../../controllers/userAuthController.js";
import { protect } from "../../middleware/authMiddleware.js";
import { validate, authSchemas } from "../../middleware/validate.js";

const router = express.Router();

router.post("/register", validate(authSchemas.register), registerUser);
router.post("/login", validate(authSchemas.login), loginUser);
router.get("/profile", protect, getProfile);

export default router;
