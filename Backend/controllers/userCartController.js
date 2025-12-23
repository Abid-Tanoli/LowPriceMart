import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [
          {
            product: product._id,
            name: product.name,
            qty,
            price: product.price,
            image: product.image,
          },
        ],
        itemsPrice: qty * product.price,
      });
    } else {
      const existingItem = cart.items.find((i) => i.product.toString() === productId);

      if (existingItem) {
        existingItem.qty += qty;
      } else {
        cart.items.push({
          product: product._id,
          name: product.name,
          qty,
          price: product.price,
          image: product.image,
        });
      }

      cart.itemsPrice = cart.items.reduce((sum, item) => sum + item.qty * item.price, 0);
      cart.updatedAt = Date.now();
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateQty = async (req, res) => {
  try {
    const { productId, qty } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.qty = qty;
    cart.itemsPrice = cart.items.reduce((sum, item) => sum + item.qty * item.price, 0);
    cart.updatedAt = Date.now();

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    cart.itemsPrice = cart.items.reduce((sum, item) => sum + item.qty * item.price, 0);
    cart.updatedAt = Date.now();

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    cart.itemsPrice = 0;
    cart.updatedAt = Date.now();

    await cart.save();
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
