import React, { createContext, useContext, useEffect, useState } from "react";
import { addToCart, removeFromCart } from "../services/cartApi";
import { useCart } from "./CartContext";

const QtyTotalsContext = createContext();

export const QtyTotalsProvider = ({ children }) => {
  const { cart, setCart } = useCart();
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    calculateTotals(cart);
  }, [cart]);

  const calculateTotals = (items) => {
    const newSubtotal = items.reduce((sum, item) => {
      if (!item?.product || !item.product.price) return sum;
      return sum + item.product.price * item.qty;
    }, 0);

    const newShipping = newSubtotal > 5000 ? 0 : 200;
    const newTax = parseFloat((newSubtotal * 0.1).toFixed(2));
    const newTotal = newSubtotal + newShipping + newTax;

    setSubtotal(newSubtotal);
    setShipping(newShipping);
    setTax(newTax);
    setTotal(newTotal);
  };

  const increaseQty = async (productId) => {
    const updatedCart = cart.map((item) => {
      if (item?.product?._id === productId && item.qty < item.product.stock) {
        addToCart(productId, 1);
        return { ...item, qty: item.qty + 1 };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const decreaseQty = async (productId) => {
    const updatedCart = cart
      .map((item) => {
        if (item?.product?._id === productId) {
          if (item.qty === 1) {
            removeFromCart(productId);
            return null;
          } else {
            addToCart(productId, -1);
            return { ...item, qty: item.qty - 1 };
          }
        }
        return item;
      })
      .filter(Boolean);
    setCart(updatedCart);
  };

  const removeItem = (productId) => {
    const updatedCart = cart.filter((i) => i?.product?._id !== productId);
    removeFromCart(productId);
    setCart(updatedCart);
  };

  return (
    <QtyTotalsContext.Provider
      value={{
        subtotal,
        shipping,
        tax,
        total,
        increaseQty,
        decreaseQty,
        removeItem,
      }}
    >
      {children}
    </QtyTotalsContext.Provider>
  );
};

export const useQtyTotals = () => useContext(QtyTotalsContext);
