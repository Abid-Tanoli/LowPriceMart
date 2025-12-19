import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("/api/admin/products", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch products", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`/api/admin/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  if (loading)
    return <p className="text-center py-10 text-xl font-semibold">Loading...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products Management</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
          Add Product
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full border-collapse bg-white">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-3 font-semibold">Image</th>
              <th className="p-3 font-semibold">Name</th>
              <th className="p-3 font-semibold">Price</th>
              <th className="p-3 font-semibold">Stock</th>
              <th className="p-3 font-semibold">Category</th>
              <th className="p-3 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-12 w-12 object-cover rounded"
                  />
                </td>

                <td className="p-3">{product.name}</td>
                <td className="p-3 font-semibold">Rs. {product.price}</td>
                <td className="p-3">{product.stock}</td>
                <td className="p-3">{product.category}</td>

                <td className="p-3 flex gap-3">
                  <button className="px-3 py-1 bg-yellow-500 text-white rounded">
                    Edit
                  </button>

                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
