import { useState } from "react";
import adminApi from "../services/adminApi";

const CreateProduct = () => {
  const [form, setForm] = useState({ name: "", price: "", stock: "", category: "", image: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminApi.post("/admin/product", form);
      alert("Product created successfully");
      setForm({ name: "", price: "", stock: "", category: "", image: "" });
    } catch {
      alert("Failed to create product");
    }
  };

  return (
    <div className="w-full flex flex-col bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Create New Product</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input name="name" placeholder="Product Name" className="input" value={form.name} onChange={handleChange} required />
        <input name="price" placeholder="Price" className="input" value={form.price} onChange={handleChange} required />
        <input name="stock" placeholder="Stock" className="input" value={form.stock} onChange={handleChange} required />
        <input name="category" placeholder="Category" className="input" value={form.category} onChange={handleChange} required />
        <input name="image" placeholder="Image URL" className="input" value={form.image} onChange={handleChange} required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded mt-3">Create Product</button>
      </form>
    </div>
  );
};

export default CreateProduct;
