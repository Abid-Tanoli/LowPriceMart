import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../services/orderApi";
import CartItem from "../components/CartItems";
import { useCart } from "../context/CartContext";
import { useQtyTotals } from "../context/QtyAndTotalsContext";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, fetchCart, clearCart } = useCart();
  const { subtotal, shipping, tax, total, increaseQty, decreaseQty, removeItem } = useQtyTotals();

  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validItems = cart.filter(item => item?.product);
    if (!validItems.length) {
      alert("Cart is empty or has invalid items!");
      return;
    }

    setLoading(true);
    
    try {
      const orderData = {
        shippingAddress,
        paymentMethod,
        orderItems: validItems.map(item => ({
          product: item.product._id,
          qty: item.qty
        }))
      };

      console.log("📦 Sending order data:", orderData);

      const res = await createOrder(orderData);
      
      console.log("✅ Order response:", res);
      alert("✅ Order placed successfully!");
      
      clearCart();
      navigate("/order-success", { state: { order: res } });
     
    } catch (err) {
      console.error("❌ ORDER ERROR:", err);
      
      const errorMsg = err.response?.data?.message 
        || err.message 
        || "Order failed. Please try again.";
      
      alert(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Checkout</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Your Cart</h3>
        {cart.length === 0 ? (
          <p className="text-gray-600">Cart is empty</p>
        ) : (
          <div className="space-y-2 border p-4 rounded bg-white">
            {cart.map(item =>
              item?.product ? (
                <CartItem
                  key={item.product._id}
                  item={item}
                  onIncrease={() => increaseQty(item.product._id)}
                  onDecrease={() => decreaseQty(item.product._id)}
                  onRemove={() => removeItem(item.product._id)}
                />
              ) : null
            )}

            <div className="mt-4 border-t pt-2 space-y-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rs {subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>Rs {shipping}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%):</span>
                <span>Rs {tax}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>Rs {total}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {["address", "city", "postalCode", "country"].map(field => (
          <div key={field}>
            <label className="block mb-1 font-semibold">
              {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
            </label>
            <input
              type="text"
              name={field}
              value={shippingAddress[field]}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Enter ${field}`}
            />
          </div>
        ))}

        <div>
          <label className="block mb-1 font-semibold">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value)}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Cash on Delivery">Cash on Delivery</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Online Banking">Online Banking</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={cart.filter(item => item?.product).length === 0 || loading}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;