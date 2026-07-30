/**
 * JazzCash HMAC-SHA256 hash unit test.
 *
 * Validates:
 *   1. verifyCallback accepts valid callback hash
 *   2. verifyCallback rejects tampered amount
 *   3. verifyCallback rejects missing hash
 *
 * Per JazzCash callback spec: salt prepended to sorted key=value, then HMAC-SHA256.
 *
 * Run: node scripts/testJazzcashHash.js
 */
import crypto from "crypto";

// Set test credentials before importing config
process.env.JAZZCASH_MERCHANT_ID = "TESTMERCHANT";
process.env.JAZZCASH_PASSWORD = "TESTPASSWORD";
process.env.JAZZCASH_INTEGRITY_SALT = "TESTINTEGRITYSALT123";
process.env.JAZZCASH_RETURN_URL = "http://localhost:5173/payment-result";
process.env.JAZZCASH_SANDBOX_URL = "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/";

const { JAZZCASH } = await import("../config/payment.js");
const { verifyCallback } = await import("../services/jazzcashService.js");

let passed = 0;
let failed = 0;

function assert(condition, name) {
  if (condition) { console.log(`  ✅ ${name}`); passed++; }
  else { console.log(`  ❌ ${name}`); failed++; }
}

console.log("=== JazzCash Hash Verification Test ===\n");

// Build standard callback data
const callbackData = {
  pp_Amount: "299900",
  pp_BillReference: "507f1f77bcf86cd799439011",
  pp_Currency: "PKR",
  pp_Description: "Order 507f1f77bcf86cd799439011",
  pp_Language: "EN",
  pp_MerchantID: "TESTMERCHANT",
  pp_Password: "TESTPASSWORD",
  pp_ResponseCode: "000",
  pp_ResponseMessage: "Successful",
  pp_ReturnURL: "http://localhost:5173/payment-result",
  pp_TxnCurrency: "PKR",
  pp_TxnDateTime: "20260728120000",
  pp_TxnRefNo: "JCTEST123456",
  pp_TxnType: "MWALLET",
  pp_Version: "2.0",
  ppmpf_1: "507f1f77bcf86cd799439011",
  ppmpf_2: "607f1f77bcf86cd799439021",
  ppmpf_3: "JazzCash",
  ppmpf_4: "",
  ppmpf_5: "",
};

// Compute valid hash
const excludeKeys = ["pp_SecureHash"];
const keys = Object.keys(callbackData).filter((k) => !excludeKeys.includes(k)).sort();
const hashString = [JAZZCASH.integritySalt, keys.map((k) => `${k}=${callbackData[k]}`).join("&")].join("&");
const validHash = crypto.createHmac("sha256", JAZZCASH.integritySalt)
  .update(hashString)
  .digest("hex")
  .toUpperCase();

const validCallback = { ...callbackData, pp_SecureHash: validHash };

// ---- Test 1: Valid callback accepts ----
console.log("Test 1: Valid callback hash");
assert(verifyCallback(validCallback) === true, "Valid callback accepted");

// ---- Test 2: Tampered amount ----
console.log("\nTest 2: Tampered amount rejected");
const tampered = { ...callbackData, pp_Amount: "999999", pp_SecureHash: validHash };
assert(verifyCallback(tampered) === false, "Tampered amount rejected");

// ---- Test 3: Missing hash ----
console.log("\nTest 3: Missing hash rejected");
assert(verifyCallback({ ...callbackData }) === false, "Missing hash rejected");

// ---- Test 4: Wrong hash ----
console.log("\nTest 4: Wrong hash rejected");
assert(verifyCallback({ ...callbackData, pp_SecureHash: "INVALIDHASH123" }) === false, "Wrong hash rejected");

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);
