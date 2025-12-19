import React, { useEffect, useState } from "react";
import api from "../services/api";
import { getOrders } from "../services/orderApi";
import { Link } from "react-router-dom";

const OrderList = () => {
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data= await  getOrders()
      if (Array.isArray(data)) {
        setMyOrders(data);
      } else if (data?.orders && Array.isArray(data.orders)) {
        setMyOrders(data.orders);
      } else {
        setMyOrders([]);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <h2 className="text-center mt-10 text-xl">Loading orders...</h2>;
  if (error) return <h2 className="text-center mt-10 text-red-500">{error}</h2>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">My Orders</h1>
      <div className="max-w-3xl mx-auto space-y-6">
        {myOrders.length > 0 ? (
          myOrders.map((order) => (
            <div key={order._id} className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
              <Link to={`/invoice/${order._id}`} className="text-xl font-bold text-green-700">
                Invoice #{order._id}
              </Link>
              <p className="text-gray-600">
                <span className="font-semibold">Date:</span>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>

              <h3 className="mt-4 text-lg font-semibold text-gray-800">Items:</h3>
              <ul className="list-disc ml-6 mt-2">
                {order.orderItems?.map((item, idx) => (
                  <li key={idx} className="text-gray-700">
                    {item.name} — {item.qty} × Rs. {item.price} = Rs. {item.qty * item.price}
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-gray-800 text-lg">
                <span className="font-semibold">Total Price:</span> Rs. {order.totalPrice}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Payment:</span> {order.paymentMethod}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Address:</span>{" "}
                {typeof order.shippingAddress === "string"
                  ? order.shippingAddress
                  : `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 text-lg">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default OrderList;