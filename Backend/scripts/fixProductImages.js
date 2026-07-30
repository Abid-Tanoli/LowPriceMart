import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const PLACEHOLDER_BASE = "https://placehold.co/600x600/e2e8f0/64748b?text=";

let confirmed = false;
let skipIds = [];

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  const db = mongoose.connection.db;

  const badPatterns = [/^http:\/\/localhost/i, /^https:\/\/example\.com/i, /via\.placeholder\.com/i];
  const allProducts = await db.collection("products").find({}).toArray();

  const badProducts = allProducts.filter(p =>
    p.image && badPatterns.some(re => re.test(p.image))
  );

  if (badProducts.length === 0) {
    console.log("No products with bad image URLs found. All images are clean.");
    await mongoose.disconnect();
    return;
  }

  console.log(`Found ${badProducts.length} product(s) with non-Cloudinary/fake image URLs:\n`);
  for (const p of badProducts) {
    console.log(`  [${p._id}] ${p.name}`);
    console.log(`       Current: ${p.image}`);
    const placeholderUrl = PLACEHOLDER_BASE + encodeURIComponent(p.name.substring(0, 30));
    console.log(`       Fix:     ${placeholderUrl}\n`);
  }

  if (!confirmed) {
    console.log("To apply fixes, re-run with: node fixProductImages.js --confirm");
    console.log("To skip specific products: node fixProductImages.js --confirm --skip ID1,ID2");
    await mongoose.disconnect();
    return;
  }

  let fixed = 0;
  for (const p of badProducts) {
    if (skipIds.includes(p._id.toString())) {
      console.log(`  Skipping [${p._id}] ${p.name}`);
      continue;
    }
    const placeholderUrl = PLACEHOLDER_BASE + encodeURIComponent(p.name.substring(0, 30));
    await db.collection("products").updateOne(
      { _id: p._id },
      { $set: { image: placeholderUrl } }
    );
    console.log(`  Updated [${p._id}] ${p.name}`);
    fixed++;
  }

  console.log(`\nDone. ${fixed} product(s) updated.`);
  await mongoose.disconnect();
};

confirmed = process.argv.includes("--confirm");
const skipArg = process.argv.find(a => a.startsWith("--skip="));
if (skipArg) skipIds = skipArg.replace("--skip=", "").split(",");

connectDB().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
