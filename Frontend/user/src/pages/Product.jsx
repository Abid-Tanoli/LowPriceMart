import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productApi";
import Pagination from "../components/global/Pagination";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState("");

  const fetchProducts = async (page = 1, selectedCategory = "") => {
    setLoading(true);
    try {
      const res = await getProducts(page, 10, selectedCategory);
      setProducts(res.docs);
      setTotalPages(res.totalPages);
      setCurrentPage(res.currentPage);
      setCategory(res.category)
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, category);
  }, [currentPage, category]);

  const addToCart = (id) => {
    console.log("Add to Cart clicked:", id);
    
  };

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-6 p-6 bg-gray-50 dark:bg-gray-900">
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
                addToCart={() => addToCart(product._id)}
              />
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(newPage) => setCurrentPage(newPage)}
      />
    </div>
  );
};

export default Product;