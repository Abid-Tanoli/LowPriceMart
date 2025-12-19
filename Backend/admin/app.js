import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import errorHandler from "./middleware/errorHandler.js";

// Routes
import adminRoutes from "./routes/adminRoutes.js";
import productsRoute from "./routes/productsRoute.js";
import dashboardRoute from "./routes/dashboard.js";

dotenv.config();
const app = express();

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB Connection Failed:", err.message));

// Middleware
app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("dev"));

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/products", productsRoute);
app.use("/api/dashboard", dashboardRoute);

app.use(errorHandler);

// Root
app.get("/", (req, res) => {
  res.send("🚀 Admin Backend is Running");
});

// Start Server
const PORT = process.env.PORT_ADMIN || 5001;
app.listen(PORT, () => console.log(`🚀 Admin Server running on port ${PORT}`));
