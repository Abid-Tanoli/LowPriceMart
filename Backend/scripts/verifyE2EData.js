import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  const db = mongoose.connection.db;

  console.log("=== Recent Orders (last 5) ===");
  const orders = await db.collection("orders").find({}).sort({ createdAt: -1 }).limit(5).toArray();
  for (const o of orders) {
    console.log(`  Order ${o._id}: paid=${o.isPaid}, method=${o.paymentMethod}, total=${o.totalPrice}, txnId=${o.transactionId || "N/A"}, createdAt=${o.createdAt}`);
  }

  console.log("\n=== E2E Test Users ===");
  const users = await db.collection("users").find({ name: /E2E/i }).toArray();
  for (const u of users) {
    console.log(`  User ${u._id}: ${u.name}, ${u.email}, role=${u.role}`);
  }

  console.log("\n=== Reviews on Products (last 5 reviews) ===");
  const products = await db.collection("products").find({ "reviews.0": { $exists: true } }).limit(5).toArray();
  for (const p of products) {
    console.log(`  Product ${p._id}: ${p.name}, rating=${p.rating || 0}, reviews=${p.reviews?.length || 0}`);
    for (const r of (p.reviews || []).slice(-3)) {
      console.log(`    Review: rating=${r.rating}, comment="${(r.comment || "").substring(0, 60)}", user=${r.user}`);
    }
  }

  console.log("\n=== Wishlists ===");
  const wishlists = await db.collection("wishlists").find({}).toArray();
  for (const w of wishlists) {
    console.log(`  Wishlist ${w._id}: user=${w.user}, products=${w.products?.length || 0}`);
  }

  await mongoose.disconnect();
  console.log("\nDone.");
};

connectDB().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
