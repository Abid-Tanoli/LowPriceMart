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

import adminControllerRoutes from "./routes/adminRoutes/adminRoutes.js";
import adminProductRoutes from "./routes/adminRoutes/productsControllerRoute.js";

dotenv.config();

const app = express();

connectDB();

app.use(helmet());
app.use(express.json());

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error("Not allowed by CORS"), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.use("/api/admin/users", adminControllerRoutes); 
app.use("/api/admin/products", adminProductRoutes); 

app.use(errorHandler);

app.get("/", (req, res) => res.send("🚀 LowPriceMart Backend Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
