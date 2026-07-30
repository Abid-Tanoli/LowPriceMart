import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";
import logger from "./utils/logger.js";

import authRoutes from "./routes/userRoutes/authRoutes.js";
import productRoutes from "./routes/userRoutes/productRoutes.js";
import cartRoutes from "./routes/userRoutes/cartRoutes.js";
import orderRoutes from "./routes/userRoutes/orderRoutes.js";
import wishlistRoutes from "./routes/userRoutes/wishlistRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes/adminRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Compression (gzip)
app.use(compression());

// CORS
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173,http://localhost:5174")
  .split(",")
  .map(s => s.trim());
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
}));

// Helmet with CSP allowing Cloudinary images
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "https://res.cloudinary.com", "https://via.placeholder.com", "https://placehold.co", "https://example.com", "data:", "blob:"],
      fontSrc: ["'self'", "https:", "data:"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'"],
    },
  },
}));

app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Global rate limit: 200 requests per 15 min per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});
app.use("/api", globalLimiter);

// Strict rate limit for auth routes: 5 requests per 15 min per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login/register attempts, please try again later." },
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);

// Error handler
app.use(errorHandler);

app.get("/", (req, res) => res.send("LowPriceMart Backend Running"));

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
}
export default app;
