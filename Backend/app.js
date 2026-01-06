// backend/app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";

import authRoutes from "./routes/userRoutes/authRoutes.js";
import productRoutes from "./routes/userRoutes/productRoutes.js";
import cartRoutes from "./routes/userRoutes/cartRoutes.js";
import orderRoutes from "./routes/userRoutes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes/adminRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// Error handler
app.use(errorHandler);

app.get("/", (req, res) => res.send("🚀 LowPriceMart Backend Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
