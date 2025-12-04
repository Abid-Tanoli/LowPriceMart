import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CartItem from "../../components/CartItems";
import { useCart } from "../../context/CartContext";
import { useQtyTotals } from "../../context/QtyAndTotalsContext";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, fetchCart } = useCart();
  const { increaseQty, decreaseQty, removeItem } = useQtyTotals();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const totalPrice = cart.reduce((sum, item) => {
    if (!item?.product || !item.product.price) return sum;
    return sum + item.product.price * item.qty;
  }, 0);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cart.map((item) =>
          item?.product ? (
            <CartItem
              key={item.product._id}
              item={item}
              onIncrease={() => increaseQty(item.product._id)}
              onDecrease={() => decreaseQty(item.product._id)}
              onRemove={() => removeItem(item.product._id)}
            />
          ) : null
        )
      )}

      <div className="mt-6 text-right text-lg font-bold">
        Total: Rs {totalPrice}
      </div>

      {cart.length > 0 && (
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate("/checkout")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
