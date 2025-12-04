import React from "react";

const QtyController = ({ qty, stock, onIncrease, onDecrease }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        className={`px-3 py-1 rounded ${qty <= 1 ? "bg-gray-200 cursor-not-allowed" : "bg-gray-300"}`}
        disabled={qty <= 1}
        onClick={onDecrease}
      >
        -
      </button>

      <span className="font-bold">{qty}</span>

      <button
        className={`px-3 py-1 rounded ${qty >= stock ? "bg-gray-200 cursor-not-allowed" : "bg-gray-300"}`}
        disabled={qty >= stock}
        onClick={onIncrease}
      >
        +
      </button>
    </div>
  );
};

export default QtyController;
