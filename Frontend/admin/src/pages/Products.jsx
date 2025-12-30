import { useEffect, useState } from "react";
import axios from "axios";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("/api/admin/products", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const productsArray = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.products)
          ? res.data.products
          : [];

        setProducts(productsArray);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const updateProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/product/${selectedProduct._id}`, selectedProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSelectedProduct(null);
      setLoading(true);

      const res = await axios.get("/api/admin/products", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const productsArray = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.products)
        ? res.data.products
        : [];

      setProducts(productsArray);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return <p className="text-center py-10 text-xl font-semibold">Loading...</p>;

  if (!products.length)
    return <p className="text-center py-10 text-xl font-semibold">No products found.</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products Management</h1>
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
              <tr key={product._id || Math.random()} className="border-t hover:bg-gray-50 transition">
                <td className="p-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-12 w-12 object-cover rounded"
                  />
                </td>
                <td className="p-3">{product.name || "N/A"}</td>
                <td className="p-3 font-semibold">Rs. {product.price || 0}</td>
                <td className="p-3">{product.stock || 0}</td>
                <td className="p-3">{product.category || "N/A"}</td>
                <td className="p-3 flex gap-3">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                  >
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

      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <input
              className="w-full border px-3 py-2 rounded mb-3"
              placeholder="Name"
              value={selectedProduct.name}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, name: e.target.value })
              }
            />
            <input
              type="number"
              className="w-full border px-3 py-2 rounded mb-3"
              placeholder="Price"
              value={selectedProduct.price}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, price: e.target.value })
              }
            />
            <input
              type="number"
              className="w-full border px-3 py-2 rounded mb-3"
              placeholder="Stock"
              value={selectedProduct.stock}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, stock: e.target.value })
              }
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={updateProduct}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
