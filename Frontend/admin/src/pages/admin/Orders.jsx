import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch orders", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading)
    return <p className="text-center py-10 text-xl font-semibold">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Orders Management</h1>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full border-collapse bg-white">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-3 font-semibold">Order ID</th>
              <th className="p-3 font-semibold">User</th>
              <th className="p-3 font-semibold">Amount</th>
              <th className="p-3 font-semibold">Payment</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Date</th>
            </tr>
          </thead>

          <tbody>
            {orders?.map((order) => (
              <tr
                key={order._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-3 font-medium">{order._id}</td>

                <td className="p-3">
                  {order.user?.name}  
                  <br />
                  <span className="text-sm text-gray-600">{order.user?.email}</span>
                </td>

                <td className="p-3 font-semibold">
                  Rs. {order.totalPrice?.toLocaleString()}
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      order.isPaid
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.isPaid ? "Paid" : "Not Paid"}
                  </span>
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      order.isDelivered
                        ? "bg-blue-100 text-blue-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {order.isDelivered ? "Delivered" : "Pending"}
                  </span>
                </td>

                <td className="p-3">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
