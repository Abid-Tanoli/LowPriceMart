import React from "react";
import { useLocation, Link } from "react-router-dom";

const OrderSuccess = () => {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="min-h-screen bg-gray-100">
      
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">LowPriceMart</h1>

        <nav className="flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-black transition">
            Home
          </Link>
          <Link to="/products" className="text-gray-700 hover:text-black transition">
            Products
          </Link>
          <Link to="/cart" className="text-gray-700 hover:text-black transition">
            Cart
          </Link>
        </nav>
      </header>

      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-8 mt-12 text-center">
        <div className="text-green-600 text-5xl">✔</div>

        <h2 className="text-3xl font-bold text-green-700 mt-4">
          Order Placed Successfully!
        </h2>

        {order ? (
          <>
            <p className="mt-6 text-gray-700 text-lg">
              <span className="font-semibold">Order ID:</span> {order._id}
            </p>

            <p className="text-gray-700 text-lg">
              <span className="font-semibold">Total Price:</span> Rs. {order.totalPrice}
            </p>

            <Link
              to="/orders"
              className="inline-block mt-8 bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg transition"
            >
              View Orders
            </Link>
          </>
        ) : (
          <p className="mt-6 text-red-500">No order data found.</p>
        )}
      </div>
    </div>
  );
};

export default OrderSuccess;