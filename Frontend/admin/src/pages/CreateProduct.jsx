import { useState } from "react";
import axios from "axios";

const CreateProduct = () => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    image: ""
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/admin/product", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Product Created Successfully");
      setForm({ name: "", price: "", stock: "", category: "", image: "" });
    } catch (err) {
      alert("Failed to create product");
    }
  };

  return (
    <div className="w-full flex flex-col bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Create New Product</h1>
      <form onSubmit={submitHandler} className="flex justify-around space-y-8 gap-3">
        <input name="name" placeholder="Product Name" className="input" value={form.name} onChange={handleChange} />
        <input name="price" placeholder="Price" className="input" value={form.price} onChange={handleChange} />
        <input name="stock" placeholder="Stock" className="input" value={form.stock} onChange={handleChange} />
        <input name="category" placeholder="Category" className="input" value={form.category} onChange={handleChange} />
        <input name="image" placeholder="Image URL" className="input" value={form.image} onChange={handleChange} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded ml-5 mb-10">Create Product</button>
      </form>
    </div>
  );
};

export default CreateProduct;
