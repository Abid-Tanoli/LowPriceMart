import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import adminApi from "../services/adminApi";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await adminApi.get(
        `/admin/products/paginated?page=${page}&limit=8&search=${search}`
        
      );
      console.log("API response:", data);
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      toast.error("Failed to load products");
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    const oldProducts = [...products];
    setProducts(products.filter((p) => p._id !== id));

    try {
      await adminApi.delete(`/admin/product/${id}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      toast.error("Failed to delete product");
      setProducts(oldProducts);
    }
  };

  const updateProduct = async () => {
    if (!selectedProduct) return;

    setSaving(true);
    try {
      const payload = { ...selectedProduct };

      if (payload.image instanceof File) {
        const formData = new FormData();
        formData.append("image", payload.image);
        formData.append("name", payload.name);
        formData.append("price", payload.price);
        formData.append("stock", payload.stock);
        formData.append("category", payload.category);

        await adminApi.put(`/admin/product/${payload._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await adminApi.put(`/admin/product/${payload._id}`, payload);
      }

      toast.success("Product updated successfully");
      setSelectedProduct(null);
      setImagePreview(null);
      fetchProducts();
    } catch (err) {
      toast.error("Failed to update product");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedProduct({ ...selectedProduct, image: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const openEditModal = (product) => {
    setSelectedProduct({ ...product });
    setImagePreview(product.image || null);
  };

  const goToPrevPage = () => setPage((p) => Math.max(1, p - 1));
  const goToNextPage = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Products Management</h1>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        className="border px-4 py-2 rounded mb-4 w-full md:w-1/3"
      />

      {loading ? (
        <p className="py-10 text-lg">Loading...</p>
      ) : products.length === 0 ? (
        <p className="py-10 text-lg">No products found.</p>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="w-full bg-white border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Category</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-12 w-12 rounded object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="p-3">{p.name}</td>
                  <td className="p-3 font-semibold">Rs. {p.price}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(p._id)}
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
      )}

      <div className="flex justify-center gap-3 mt-6 items-center">
        <button
          disabled={page === 1}
          onClick={goToPrevPage}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-4 py-2 font-semibold">
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={goToNextPage}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>

            <input
              className="w-full border px-3 py-2 rounded mb-2"
              placeholder="Name"
              value={selectedProduct.name}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, name: e.target.value })
              }
            />

            <input
              type="number"
              className="w-full border px-3 py-2 rounded mb-2"
              placeholder="Price"
              value={selectedProduct.price}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  price: Number(e.target.value),
                })
              }
            />

            <input
              type="number"
              className="w-full border px-3 py-2 rounded mb-2"
              placeholder="Stock"
              value={selectedProduct.stock}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  stock: Number(e.target.value),
                })
              }
            />

            <input
              className="w-full border px-3 py-2 rounded mb-2"
              placeholder="Category"
              value={selectedProduct.category}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, category: e.target.value })
              }
            />

            <input type="file" onChange={handleImageChange} className="mb-3" />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="preview"
                className="h-24 w-24 object-cover rounded mb-3"
              />
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setImagePreview(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={updateProduct}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
