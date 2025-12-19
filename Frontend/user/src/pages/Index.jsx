import React, { useState, useEffect } from "react";
import { Carousel } from "flowbite-react";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productApi";
import Pagination from "../components/global/Pagination";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState("");
  const [newArrivals, setNewArrivals] = useState([]);

  const fetchProducts = async (page = 1, selectedCategory = "") => {
    setLoading(true);
    try {
      const res = await getProducts(page, 10, selectedCategory);
      setProducts(res.docs || []);
      setTotalPages(res.totalPages || 1);
      setCurrentPage(res.currentPage || 1);
      setNewArrivals((res.docs || []).slice(0, 5));
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, category);
  }, [currentPage, category]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="w-full flex flex-row justify-between mt-5 px-10">
        <div className="mt-3">
          <h1 className="text-2xl font-bold text-blue-600">
            Welcome to LowPriceMart 
          </h1>
          <p className="mt-2 text-gray-600">
            Your best place for affordable products
          </p>
        </div>

        <div>
          <select
            value={category}
            onChange={handleCategoryChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 mt-8"
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothes">Clothes</option>
            <option value="Shoes">Shoes</option>
            <option value="Furniture">Furniture</option>
          </select>
        </div>
      </div>

      <div className="relative w-full h-[400px] mt-10">
        <Carousel
          slideInterval={3000}
          indicators={true}
          leftControl="‹"
          rightControl="›"
          className="rounded-xl shadow-md"
        >
          <img
            src="https://images.unsplash.com/photo-1606813902910-4b9c3ab7bfcf?auto=format&fit=crop&w=1500&q=80"
            alt="Banner 1"
            className="object-cover w-full h-[400px]"
          />
          <img
            src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1500&q=80"
            alt="Banner 2"
            className="object-cover w-full h-[400px]"
          />
          <img
            src="https://images.unsplash.com/photo-1561715276-a2d087060f1a?auto=format&fit=crop&w=1500&q=80"
            alt="Banner 3"
            className="object-cover w-full h-[400px]"
          />
          <img
            src="https://images.unsplash.com/photo-1578898887932-dce23a912e2c?auto=format&fit=crop&w=1500&q=80"
            alt="Banner 4"
            className="object-cover w-full h-[400px]"
          />
        </Carousel>

        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white">
          <h2 className="text-4xl font-bold mb-2">Discover New Trends</h2>
          <p className="text-lg">Exclusive Deals Every Day</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-5 justify-center mt-16">
        {loading ? (
          <p>Loading products...</p>
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              category={product.category}
              brand={product.brand || "N/A"}
              price={product.price}
              description={product.description}
              countInStock={product.stock}
            />
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(newPage) => setCurrentPage(newPage)}
      />

      {/* New Arrivals Section */}
      <section className="w-450 mt-20 bg-white py-16 px-10 text-black text-center rounded-2xl shadow-lg">
        <h2 className="text-5xl font-extrabold mb-4">New Arrivals</h2>
        <p className="text-lg text-gray-800 mb-10">
          Freshly stocked items — grab yours before they’re gone!
        </p>

        {loading ? (
          <p>Loading new arrivals...</p>
        ) : newArrivals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-8">
            {newArrivals.map((item) => (
              <div
                key={item._id}
                className="bg-blue-200 text-gray-900 rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
              >
                <img
                  src={item.image || "https://via.placeholder.com/300"}
                  alt={item.name}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-blue-700 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {item.description?.slice(0, 50)}...
                  </p>
                  <span className="font-bold text-lg text-green-600">
                    Rs. {item.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No new arrivals found.</p>
        )}
      </section>

      {/* Deals Section */}
      <section className="bg-white w-450 rounded-2xl py-16 px-10 mt-20 mb-20 text-center">
        <h2 className="text-4xl font-bold text-red-700 mb-10">
          Deals To Avail
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 px-10">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <div
              key={index}
              className="bg-blue-200 rounded-xl shadow-md hover:shadow-lg transition duration-300"
            >
              <img
                className="w-full h-48 object-cover rounded-t-xl"
                src="https://via.placeholder.com/300"
                alt="Deal"
              />
              <div className="p-4">
                <h3 className="text-blue-700 font-semibold mb-2">
                  Amazing Product
                </h3>
                <p className="text-gray-600 text-sm">
                  Grab this exclusive deal before it expires!
                </p>
                <button className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
                  View Deal
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;