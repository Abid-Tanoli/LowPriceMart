import crypto from "crypto";
import { JAZZCASH } from "../config/payment.js";

/**
 * Generate JazzCash transaction form data
 * @param {Object} order - order document
 * @returns {Object} fields for auto-submit form
 */
export function generateTransaction(order) {
  const txnRefNo = `JC${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const txnDateTime = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  const txnExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  const amountInPaisa = Math.round(order.totalPrice * 100);

  const fields = {
    pp_Version: "2.0",
    pp_TxnType: "MWALLET",
    pp_Language: "EN",
    pp_MerchantID: JAZZCASH.merchantId,
    pp_Password: JAZZCASH.password,
    pp_TxnRefNo: txnRefNo,
    pp_Amount: amountInPaisa,
    pp_TxnCurrency: "PKR",
    pp_TxnDateTime: txnDateTime,
    pp_BillReference: order._id.toString(),
    pp_Description: `Order ${order._id}`,
    pp_TxnExpiryDateTime: txnExpiry,
    pp_ReturnURL: JAZZCASH.returnUrl,
    pp_SecureHash: "",
    ppmpf_1: order._id.toString(),
    ppmpf_2: order.user?.toString() || "",
    ppmpf_3: order.paymentMethod,
    ppmpf_4: "",
    ppmpf_5: "",
  };

  // Generate secure hash
  const hashString = [
    JAZZCASH.integritySalt,
    ..."pp_Version=2.0&pp_TxnType=MWALLET&pp_Language=EN&pp_MerchantID=" + JAZZCASH.merchantId
      + "&pp_Password=" + JAZZCASH.password
      + "&pp_TxnRefNo=" + txnRefNo
      + "&pp_Amount=" + amountInPaisa
      + "&pp_TxnCurrency=PKR"
      + "&pp_TxnDateTime=" + txnDateTime
      + "&pp_BillReference=" + order._id
      + "&pp_Description=Order " + order._id
      + "&pp_TxnExpiryDateTime=" + txnExpiry
      + "&pp_ReturnURL=" + JAZZCASH.returnUrl
      + "&ppmpf_1=" + order._id
      + "&ppmpf_2=" + (order.user?._id || order.user || "")
      + "&ppmpf_3=" + order.paymentMethod
      + "&ppmpf_4="
      + "&ppmpf_5=",
  ].join("&");

  fields.pp_SecureHash = crypto.createHmac("sha256", JAZZCASH.integritySalt)
    .update(hashString)
    .digest("hex")
    .toUpperCase();

  return { url: JAZZCASH.sandboxUrl, fields };
}

/**
 * Verify JazzCash callback response
 * @param {Object} data - callback POST body
 * @returns {boolean}
 */
export function verifyCallback(data) {
  const recvHash = data.pp_SecureHash;
  if (!recvHash) return false;

  // Rebuild hash from callback data (sorted alphabetically by field name except hash)
  const excludeKeys = ["pp_SecureHash"];
  const keys = Object.keys(data).filter((k) => !excludeKeys.includes(k)).sort();

  const hashString = keys.map((k) => `${k}=${data[k]}`).join("&");
  const computedHash = crypto.createHmac("sha256", JAZZCASH.integritySalt)
    .update(hashString)
    .digest("hex")
    .toUpperCase();

  return computedHash === recvHash;
}
