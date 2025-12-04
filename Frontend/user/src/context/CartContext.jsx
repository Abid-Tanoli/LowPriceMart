import React, { createContext, useState, useEffect, useContext } from "react";
import { getCart, addToCart as addToCartApi, removeFromCart as removeFromCartApi, clearCart as clearCartApi } from "../services/cartApi";
import { useSelector } from "react-redux"; // <- to get user from auth slice

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useSelector((state) => state.auth); // Get logged-in user
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (!user) return; // Only fetch cart if user is logged in
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    try {
      const data = await getCart();
      const items = Array.isArray(data) ? data[0]?.items : data.items;
      setCart(items || []);
    } catch (err) {
      console.error("Failed to fetch cart:", err.message);
      setCart([]);
    }
  };

  const addToCart = async (productId, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prev, { productId, qty }];
    });

    try {
      await addToCartApi(productId, qty);
    } catch (err) {
      console.error("Failed to add to cart:", err.message);
      fetchCart();
    }
  };

  const removeFromCart = async (productId) => {
    const prevCart = [...cart];

    setCart((prev) => prev.filter((item) => item.productId !== productId));

    try {
      await removeFromCartApi(productId);
    } catch (err) {
      console.error("Failed to remove from cart:", err.message);
      setCart(prevCart); 
    }
  };

  const clearCart = async () => {
    const prevCart = [...cart];
    setCart([]);

    try {
      await clearCartApi();
    } catch (err) {
      console.error("Failed to clear cart:", err.message);
      setCart(prevCart); 
    }
  };

  return (
    <CartContext.Provider value={{ cart, setCart, fetchCart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
