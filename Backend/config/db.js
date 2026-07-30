import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    logger.info("MongoDB already connected, reusing existing connection");
    return mongoose.connection;
  }
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);
    logger.info(`MongoDB connected: ${connect.connection.host}`);
    return connect;
  } catch (err) {
    logger.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
