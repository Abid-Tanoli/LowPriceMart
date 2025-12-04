import React from "react";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { addToCart } from "../services/cartApi";

const ProductCard = ({
  _id,
  image,
  name,
  category,
  brand,
  price,
  description,
  countInStock,
}) => {
  const handleCart = async () => {
    try {
      await addToCart(_id, 1);
      alert(`${name} added to cart successfully!`);
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("Failed to add item. Please login or try again.");
    }
  };

  return (
    <div className="w-80 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-700 mt-5 mb-8">
      
      <img
        className="rounded-t-lg w-full h-56 object-cover"
        src={image || "https://via.placeholder.com/300"}
        alt={name}
      />

      <div className="p-5">
        <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          {name}
        </h5>

        {brand && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Brand:
            </span>{" "}
            {brand}
          </p>
        )}

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            Category:
          </span>{" "}
          {category}
        </p>

        <p className="text-sm text-gray-800 dark:text-gray-200 mb-3 line-clamp-3">
          {description}
        </p>

        <div className="mt-2 mb-3">
          {countInStock > 0 ? (
            <span className="px-3 py-1 text-xs font-bold bg-green-500 text-white rounded-full">
              In Stock
            </span>
          ) : (
            <span className="px-3 py-1 text-xs font-bold bg-red-500 text-white rounded-full">
              Out of Stock
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              Rs. {price}
            </span>

            <button
              onClick={handleCart}
              disabled={countInStock === 0}
              className={`inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-white rounded-lg 
                transition focus:ring-4 focus:outline-none
                ${
                  countInStock === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                }`}
            >
              {countInStock === 0 ? "Out of Stock" : "Add to Cart"}
              {countInStock > 0 && <ShoppingCart size={16} />}
            </button>
          </div>

          <Link
            to={`/product/${_id}`}
            className="inline-block text-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg 
              hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 
              dark:hover:bg-green-500 dark:focus:ring-green-800 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
