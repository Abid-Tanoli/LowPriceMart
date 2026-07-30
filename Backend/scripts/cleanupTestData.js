import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const TEST_NAME_PATTERNS = [/Test/i, /Verify/i, /E2E/i];
const TEST_EMAIL_PATTERNS = [/test/i, /e2e/i];

let confirmed = false;

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  const db = mongoose.connection.db;

  console.log("=== Test Products Found ===");
  const productQueries = TEST_NAME_PATTERNS.map(pattern => ({ name: pattern }));
  const testProducts = await db.collection("products").find({ $or: productQueries }).toArray();
  if (testProducts.length === 0) {
    console.log("  No test products found.");
  } else {
    for (const p of testProducts) {
      console.log(`  [${p._id}] ${p.name} — Rs. ${p.price} — ${p.category} — image: ${p.image || "N/A"}`);
    }
  }

  console.log("\n=== Test Users Found ===");
  const userQueries = [
    ...TEST_NAME_PATTERNS.map(pattern => ({ name: pattern })),
    ...TEST_EMAIL_PATTERNS.map(pattern => ({ email: pattern })),
  ];
  const testUsers = await db.collection("users").find({ $or: userQueries }).toArray();
  if (testUsers.length === 0) {
    console.log("  No test users found.");
  } else {
    for (const u of testUsers) {
      console.log(`  [${u._id}] ${u.name} — ${u.email} — role: ${u.role}`);
    }
  }

  console.log("\n---");
  console.log(`Total: ${testProducts.length} product(s), ${testUsers.length} user(s) found.`);

  if (testProducts.length === 0 && testUsers.length === 0) {
    console.log("Nothing to clean up.");
    await mongoose.disconnect();
    return;
  }

  if (!confirmed) {
    console.log("\nTo delete these items, re-run with: node cleanupTestData.js --confirm");
    await mongoose.disconnect();
    return;
  }

  if (testProducts.length > 0) {
    const productIds = testProducts.map(p => p._id);
    const deleteResult = await db.collection("products").deleteMany({ _id: { $in: productIds } });
    console.log(`\nDeleted ${deleteResult.deletedCount} product(s).`);
  }

  if (testUsers.length > 0) {
    const userIds = testUsers.map(u => u._id);
    await db.collection("wishlists").deleteMany({ user: { $in: userIds } });
    await db.collection("carts").deleteMany({ user: { $in: userIds } });
    const deleteResult = await db.collection("users").deleteMany({ _id: { $in: userIds } });
    console.log(`Deleted ${deleteResult.deletedCount} user(s) (and their wishlists/carts).`);
  }

  await mongoose.disconnect();
  console.log("Cleanup complete.");
};

confirmed = process.argv.includes("--confirm");
connectDB().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
