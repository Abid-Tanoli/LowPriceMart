// REPLACE WITH SANDBOX CREDENTIALS FROM MERCHANT DASHBOARD
export const JAZZCASH = {
  merchantId: process.env.JAZZCASH_MERCHANT_ID || "",
  password: process.env.JAZZCASH_PASSWORD || "",
  integritySalt: process.env.JAZZCASH_INTEGRITY_SALT || "",
  returnUrl: process.env.JAZZCASH_RETURN_URL || "http://localhost:5173/payment-result",
  sandboxUrl: process.env.JAZZCASH_SANDBOX_URL || "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/",
  // Live URL: "https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/",
};

export const EASYPAISA = {
  storeId: process.env.EASYPAISA_STORE_ID || "",
  hashKey: process.env.EASYPAISA_HASH_KEY || "",
  returnUrl: process.env.EASYPAISA_RETURN_URL || "http://localhost:5173/payment-result",
  sandboxUrl: process.env.EASYPAISA_SANDBOX_URL || "https://easypay-staging.easypaisa.com.pk/easypay/Index.jsf",
  // Live URL: "https://easypay.easypaisa.com.pk/easypay/Index.jsf",
};
