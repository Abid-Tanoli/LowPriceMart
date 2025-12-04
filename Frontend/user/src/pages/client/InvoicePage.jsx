import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { generateInvoicePDF } from "../../components/PDFInvoice";

const InvoicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

const handleDownloadPDF = async () => {
  if (!order) return;
  await generateInvoicePDF(order);
};

  const handlePrint = () => window.print();

  const formatAddress = (addr) => {
    if (!addr) return "N/A";
    if (typeof addr === "string") return addr;
    return `${addr.address}, ${addr.city}, ${addr.postalCode}, ${addr.country}`;
  };

  if (loading || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl text-gray-700 font-medium">Loading invoice...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 print:bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6 print:hidden">
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition"
          >
            ← Back to Orders
          </button>
          <div className="flex gap-3">
            <button onClick={handlePrint} className="bg-white px-4 py-2 rounded border">
              Print
            </button>
            <button onClick={handleDownloadPDF} className="bg-blue-600 text-white px-4 py-2 rounded">
              Download PDF
            </button>
          </div>
        </div>

        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden print:shadow-none print:rounded-none p-8">
          <h1 className="text-3xl font-bold mb-4">Invoice #{order._id.slice(-8).toUpperCase()}</h1>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Payment Status:</strong> {order.isPaid ? "PAID" : "PENDING"}</p>
          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>

          <div className="mt-6">
            <h2 className="font-bold mb-2">Bill To</h2>
            <p>{order.user?.name || "N/A"}</p>
            <p>{order.user?.email || "N/A"}</p>
            <p>{formatAddress(order.shippingAddress)}</p>
          </div>

          <div className="mt-6">
            <h2 className="font-bold mb-2">Order Items</h2>
            <table className="w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-200">
                  <th>#</th>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map((item, i) => (
                  <tr key={i} className="border-t border-gray-200">
                    <td className="text-center">{i + 1}</td>
                    <td>{item.name}</td>
                    <td className="text-center">{item.qty}</td>
                    <td className="text-right">Rs. {item.price.toLocaleString()}</td>
                    <td className="text-right">Rs. {(item.qty * item.price).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-6">
            <div>
              <p><strong>Subtotal:</strong> Rs. {order.itemsPrice.toLocaleString()}</p>
              <p><strong>Total:</strong> Rs. {order.totalPrice.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;