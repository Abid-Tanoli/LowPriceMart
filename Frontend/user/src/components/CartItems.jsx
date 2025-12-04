import React from "react";
import QtyController from "./QtyController";

const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  return (
    <div className="flex justify-between items-center border-b py-3">
      <div className="flex items-center gap-4">
        <img
          src={item.product.image}
          alt={item.product.name}
          className="w-20 h-20 object-cover rounded"
        />
        <div>
          <h3 className="font-bold">{item.product.name}</h3>
          <p>Rs {item.product.price}</p>
        </div>
      </div>

      <QtyController
        qty={item.qty}
        stock={item.product.stock}
        onIncrease={() => onIncrease(item.product._id)}
        onDecrease={() => onDecrease(item.product._id, item.qty)}
      />

      <button
        onClick={() => onRemove(item.product._id)}
        className="text-red-600 font-bold px-3 py-1"
      >
        Remove
      </button>
    </div>
  );
};

export default CartItem;
