import Product from "../../models/Product.js";
import Order from "../../models/Order.js";
import Cart from "../../models/Cart.js";
import { sendEmail } from "../../services/emailService.js";

export const createOrder = async (req, res) => {
  try {
    console.log("Creating order for user:", req.user?._id);
    console.log("Request body:", req.body);

    const { productId, qty, shippingAddress, paymentMethod, items, orderItems } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: "Shipping address and payment method are required" });
    }

    let finalOrderItems = [];
    let itemsPrice = 0;

    if (orderItems?.length > 0) {
      for (let item of orderItems) {
        const product = await Product.findById(item.product);
        if (!product) return res.status(404).json({ message: `Product not found: ${item.product}` });
        if (product.stock < item.qty) return res.status(400).json({ message: `Insufficient stock for ${product.name}` });

        finalOrderItems.push({
          product: item.product,
          name: product.name,
          qty: item.qty,
          price: product.price,
          image: product.image,
        });
        itemsPrice += product.price * item.qty;
      }
    }
    else if (items?.length > 0) {
      for (let item of items) {
        const product = await Product.findById(item.product);
        if (!product) return res.status(404).json({ message: `Product not found: ${item.product}` });
        if (product.stock < item.qty) return res.status(400).json({ message: `Insufficient stock for ${product.name}` });

        finalOrderItems.push({
          product: item.product,
          name: product.name,
          qty: item.qty,
          price: product.price,
          image: product.image,
        });
        itemsPrice += product.price * item.qty;
      }
    }
    else if (productId && qty) {
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ message: "Product not found" });
      if (product.stock < qty) return res.status(400).json({ message: "Insufficient stock" });

      finalOrderItems.push({
        product: product._id,
        name: product.name,
        qty,
        price: product.price,
        image: product.image,
      });
      itemsPrice = product.price * qty;
    }
    else {
      const cart = await Cart.findOne({ user: req.user._id });
      console.log("User cart:", cart);

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      for (let item of cart.items) {
        const product = await Product.findById(item.product);
        if (!product) return res.status(404).json({ message: `Product not found: ${item.product}` });
        if (product.stock < item.qty) return res.status(400).json({ message: `Insufficient stock for ${product.name}` });

        finalOrderItems.push({
          product: item.product,
          name: product.name,
          qty: item.qty,
          price: product.price,
          image: product.image,
        });
        itemsPrice += product.price * item.qty;
      }

      cart.items = [];
      cart.itemsPrice = 0;
      await cart.save();
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems: finalOrderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      totalPrice: itemsPrice,
    });

    for (let item of finalOrderItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.qty } });
    }

    try {
      const info = await sendEmail({
        to: req.user.email,
        subject: "Order Confirmation",
        text: "Your order has been placed successfully.",
        html: "<b>Your order has been placed successfully.</b>",
      });
      console.log("Email sent successfully:", info.response);
    } catch (err) {
      console.error("Failed to send email:", err);
    }

    console.log("✅ Order created successfully:", order._id);
    res.status(201).json(order);
  } catch (error) {
    console.error("❌ Create order error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.isPaid = true;
    order.paidAt = Date.now();
    await order.save();

    res.json({ message: "Order marked as paid", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    await order.save();

    res.json({ message: "Order delivered", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
