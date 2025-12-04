export const generateInvoicePDF = async (order) => {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF({ unit: "mm", format: "a4" });

  doc.setFontSize(22);
  doc.text("INVOICE", 14, 20);

  doc.setFontSize(12);
  doc.text(`Invoice Number: ${order._id.slice(-8).toUpperCase()}`, 14, 30);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 36);
  doc.text(`Payment Status: ${order.isPaid ? "PAID" : "PENDING"}`, 14, 42);
  doc.text(`Payment Method: ${order.paymentMethod}`, 14, 48);

  doc.setFontSize(14);
  doc.text("Bill To", 14, 60);

  doc.setFontSize(11);
  doc.text(order.user?.name || "N/A", 14, 66);
  doc.text(order.user?.email || "N/A", 14, 72);

  const address =
    typeof order.shippingAddress === "string"
      ? order.shippingAddress
      : `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`;

  doc.text(address, 14, 78);

  const tableData = order.orderItems.map((item, i) => [
    i + 1,
    item.name,
    item.qty,
    `Rs. ${item.price.toLocaleString()}`,
    `Rs. ${(item.qty * item.price).toLocaleString()}`,
  ]);

  autoTable(doc, {
    startY: 90,
    head: [["#", "Item", "Qty", "Unit Price", "Amount"]],
    body: tableData,
    theme: "grid",
  });

  const finalY = doc.lastAutoTable.finalY + 10;

  doc.setFontSize(13);
  doc.text(`Subtotal: Rs. ${order.itemsPrice.toLocaleString()}`, 140, finalY, { align: "right" });
  doc.text(`Total: Rs. ${order.totalPrice.toLocaleString()}`, 140, finalY + 8, { align: "right" });

  doc.save(`Invoice-${order._id.slice(-8)}.pdf`);
};
