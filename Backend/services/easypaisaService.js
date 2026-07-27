import crypto from "crypto";
import { EASYPAISA } from "../config/payment.js";

/**
 * Generate EasyPaisa transaction form data
 * @param {Object} order - order document
 * @returns {Object} fields for auto-submit form
 */
export function generateTransaction(order) {
  const txnRefNo = `EP${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const amountInPaisa = Math.round(order.totalPrice * 100);

  const fields = {
    storeId: EASYPAISA.storeId,
    amount: amountInPaisa.toString(),
    orderRefNum: order._id.toString(),
    paymentMethod: "easypay",
    transactionDateTime: new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14),
    merchantReturnUrl: EASYPAISA.returnUrl,
    description: `Order ${order._id}`,
    signature: "",
    // Additional fields as required by EasyPaisa
    storeId_extra: EASYPAISA.storeId,
    orderId: txnRefNo,
  };

  // Generate HMAC signature (EasyPaisa uses POST + hash key)
  const hashString = [
    EASYPAISA.hashKey,
    fields.amount,
    fields.orderRefNum,
    fields.storeId,
    txnRefNo,
    fields.transactionDateTime,
    fields.merchantReturnUrl,
    EASYPAISA.hashKey,
  ].join("&");

  fields.signature = crypto.createHmac("sha256", EASYPAISA.hashKey)
    .update(hashString)
    .digest("hex")
    .toUpperCase();

  fields.orderId = txnRefNo;

  return { url: EASYPAISA.sandboxUrl, fields };
}

/**
 * Verify EasyPaisa callback response
 * @param {Object} data - callback POST body
 * @returns {boolean}
 */
export function verifyCallback(data) {
  const recvSignature = data.signature;
  if (!recvSignature) return false;

  // EasyPaisa callback verification (field order matters)
  const hashString = [
    EASYPAISA.hashKey,
    data.merchantReturnUrl || "",
    data.orderId || "",
    data.orderRefNum || "",
    data.paymentMethod || "",
    data.responseCode || "",
    data.responseMessage || "",
    data.transactionDateTime || "",
    data.transactionId || "",
    EASYPAISA.hashKey,
  ].join("&");

  const computed = crypto.createHmac("sha256", EASYPAISA.hashKey)
    .update(hashString)
    .digest("hex")
    .toUpperCase();

  return computed === recvSignature;
}
