import Order from "../models/Order.js";
import logger from "../utils/logger.js";
import { generateTransaction as jazzcashGenerate, verifyCallback as jazzcashVerify } from "../services/jazzcashService.js";
import { generateTransaction as easypaisaGenerate, verifyCallback as easypaisaVerify } from "../services/easypaisaService.js";

export const initiateJazzCashPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.body.orderId).populate("user", "_id");
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { url, fields } = jazzcashGenerate(order);
    res.json({ redirectUrl: url, fields });
  } catch (err) {
    logger.error("JazzCash initiate error:", err.message);
    res.status(500).json({ message: "Payment initiation failed" });
  }
};

// PUBLIC route - called by JazzCash server (secured by HMAC-SHA256 verification)
export const jazzCashCallback = async (req, res) => {
  try {
    const data = req.body;

    // SECURITY: Strict hash verification (always first check)
    if (!jazzcashVerify(data)) {
      logger.error("JazzCash callback hash mismatch");
      return res.status(400).send("FAILURE");
    }

    const order = await Order.findById(data.pp_BillReference);
    if (!order) {
      logger.error("JazzCash callback: order not found", data.pp_BillReference);
      return res.status(404).send("FAILURE");
    }

    // IDEMPOTENCY: Already paid — early return, no side-effects
    if (order.isPaid) {
      logger.info(`JazzCash callback: order ${order._id} already paid, skipping`);
      return res.send("OK");
    }

    const txnStatus = data.pp_ResponseCode;
    if (txnStatus === "000") {
      // AMOUNT VERIFICATION: Defend against tampering
      const paidAmount = Number(data.pp_Amount) / 100;
      if (Math.abs(paidAmount - order.totalPrice) > 0.01) {
        logger.error(`JazzCash amount mismatch: paid ${paidAmount}, expected ${order.totalPrice}`);
        return res.status(400).send("FAILURE");
      }

      order.isPaid = true;
      order.paidAt = new Date();
      order.transactionId = data.pp_TxnRefNo;
      await order.save();
      logger.info(`Order ${order._id} paid via JazzCash (txn: ${data.pp_TxnRefNo})`);
      res.send("OK");
    } else {
      logger.warn(`JazzCash payment failed for order ${order._id}: code ${txnStatus}`);
      res.send("FAILURE");
    }
  } catch (err) {
    logger.error("JazzCash callback error:", err.message);
    res.status(500).send("FAILURE");
  }
};

export const initiateEasyPaisaPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.body.orderId).populate("user", "_id");
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { url, fields } = easypaisaGenerate(order);
    res.json({ redirectUrl: url, fields });
  } catch (err) {
    logger.error("EasyPaisa initiate error:", err.message);
    res.status(500).json({ message: "Payment initiation failed" });
  }
};

// PUBLIC route - called by EasyPaisa server (secured by HMAC-SHA256 verification)
export const easyPaisaCallback = async (req, res) => {
  try {
    const data = req.body;

    // SECURITY: Strict hash verification (always first check)
    if (!easypaisaVerify(data)) {
      logger.error("EasyPaisa callback hash mismatch");
      return res.status(400).send("FAILURE");
    }

    const order = await Order.findById(data.orderRefNum);
    if (!order) {
      logger.error("EasyPaisa callback: order not found", data.orderRefNum);
      return res.status(404).send("FAILURE");
    }

    // IDEMPOTENCY: Already paid — early return, no side-effects
    if (order.isPaid) {
      logger.info(`EasyPaisa callback: order ${order._id} already paid, skipping`);
      return res.send("OK");
    }

    if (data.responseCode === "0" || data.responseCode === "000") {
      // AMOUNT VERIFICATION: Defend against tampering
      const paidAmount = Number(data.amount) / 100;
      if (Math.abs(paidAmount - order.totalPrice) > 0.01) {
        logger.error(`EasyPaisa amount mismatch: paid ${paidAmount}, expected ${order.totalPrice}`);
        return res.status(400).send("FAILURE");
      }

      order.isPaid = true;
      order.paidAt = new Date();
      order.transactionId = data.transactionId || data.orderId;
      await order.save();
      logger.info(`Order ${order._id} paid via EasyPaisa (txn: ${order.transactionId})`);
      res.send("OK");
    } else {
      logger.warn(`EasyPaisa payment failed for order ${order._id}: code ${data.responseCode}`);
      res.send("FAILURE");
    }
  } catch (err) {
    logger.error("EasyPaisa callback error:", err.message);
    res.status(500).send("FAILURE");
  }
};
