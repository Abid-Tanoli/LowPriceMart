import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "../services/orderApi";

const steps = [
  { id: 1, title: "Order Placed" },
  { id: 2, title: "Processing" },
  { id: 3, title: "Shipped" },
  { id: 4, title: "Delivered" },
];

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const data = await getOrderById(id);
      setOrder(data);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading) return <h2 className="text-center mt-10 text-xl">Loading order details...</h2>;
  if (!order) return <h2 className="text-center mt-10 text-red-500">Order not found.</h2>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
   
      <div className="max-w-4xl mx-auto bg-white shadow-lg p-6 rounded-xl border">
        <h1 className="text-3xl font-bold text-gray-800">Order Details</h1>
        <p className="text-gray-600">
          Order ID: <span className="font-semibold">{order._id}</span>
        </p>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Tracking</h2>
          <div className="flex flex-col md:flex-row justify-between items-center relative">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center text-center w-full">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 
                  ${index < order.statusIndex ? "bg-green-600 text-white border-green-600" : "border-gray-400"}`}
                >
                  {step.id}
                </div>
                <p className="mt-2 text-gray-700">{step.title}</p>
              </div>
            ))}

            <div className="absolute top-5 left-0 w-full h-1 bg-gray-300 -z-10 md:block hidden"></div>
            <div
              className="absolute top-5 left-0 h-1 bg-green-600 -z-10 md:block hidden"
              style={{ width: `${(order.statusIndex / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Items</h2>
          <table className="w-full border">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 text-left">Product</th>
                <th className="p-2 text-left">Qty</th>
                <th className="p-2 text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.qty}</td>
                  <td className="p-2">Rs. {item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Shipping Information</h2>
          <p className="text-gray-700">
            <span className="font-semibold">Address:</span>{" "}
            {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Payment</h2>
          <p className="text-gray-700">
            <span className="font-semibold">Status: </span>
            {order.paymentMethod}
          </p>
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded-xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Order Summary</h2>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Total Price:</span> Rs. {order.totalPrice}
          </p>
        </div>

        <div className="mt-10 flex justify-between">
          <Link
            to="/orders"
            className="bg-gray-700 hover:bg-black text-white px-4 py-2 rounded-lg"
          >
            Back to My Orders
          </Link>

          <Link
            to={`/invoice/${order._id}`}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Download Invoice
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;