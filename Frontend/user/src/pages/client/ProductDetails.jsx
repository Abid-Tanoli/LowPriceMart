import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { getProductById, getRelatedProducts } from "../../services/productApi";
import { addToCart } from "../../services/cartApi";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getProductById(id);
        setProduct(res);

        const relatedRes = await getRelatedProducts(id);
        setRelated(relatedRes);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    setQuantity(1);
  }, [id]);

  const handleAddToCart = async () => {
    if (isAdding || !product || product.countInStock === 0) return;

    setIsAdding(true);
    try {
      await addToCart(product._id, quantity);
      alert(`${quantity} x ${product.name} added to cart successfully!`);
      setQuantity(1);
    } catch (error) {
      console.error("Add to cart error:", error);
      if (error.response?.status === 401) {
        alert("Please login to add items to cart.");
        navigate("/login");
      } else {
        alert(error.response?.data?.message || "Failed to add item. Please try again.");
      }
    } finally {
      setIsAdding(false);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.countInStock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 dark:text-gray-300">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">Product not found.</p>
        <button
          onClick={() => navigate("/product")}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          <ArrowLeft size={20} />
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto py-4 px-4 md:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4 md:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row gap-8 p-6 md:p-8">
            <div className="md:w-1/2">
              <div className="sticky top-8">
                <img
                  src={product.image || "https://via.placeholder.com/600"}
                  alt={product.name}
                  className="w-full object-cover rounded-xl shadow-md"
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {product.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                  {product.category}
                </span>
                {product.brand && (
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                    {product.brand}
                  </span>
                )}
              </div>

              <div className="mt-2">
                {product.countInStock > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="px-4 py-2 text-sm font-bold bg-green-500 text-white rounded-full">
                      In Stock
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {product.countInStock} {product.countInStock === 1 ? 'unit' : 'units'} available
                    </span>
                  </div>
                ) : (
                  <span className="px-4 py-2 text-sm font-bold bg-red-500 text-white rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h2 className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
                  Rs. {product.price?.toLocaleString()}
                </h2>
              </div>

              {product.countInStock > 0 && (
                <div className="flex items-center gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Quantity:</span>
                  <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className={`px-4 py-2 rounded-md font-bold transition ${
                        quantity <= 1
                          ? "bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed"
                          : "bg-white dark:bg-gray-600 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-500"
                      }`}
                    >
                      -
                    </button>
                    <span className="px-6 py-2 font-bold text-gray-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= product.countInStock}
                      className={`px-4 py-2 rounded-md font-bold transition ${
                        quantity >= product.countInStock
                          ? "bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed"
                          : "bg-white dark:bg-gray-600 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-500"
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={product.countInStock === 0 || isAdding}
                className={`mt-4 inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-medium text-white rounded-xl focus:ring-4 focus:outline-none transition-all ${
                  product.countInStock === 0 || isAdding
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 dark:hover:bg-blue-500 dark:focus:ring-blue-800 shadow-lg hover:shadow-xl"
                }`}
              >
                {isAdding ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Adding to Cart...
                  </>
                ) : product.countInStock === 0 ? (
                  "Out of Stock"
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    Add {quantity} to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="max-w-7xl mx-auto mt-12 px-4 md:px-8 pb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {related.map((item) => (
              <div
                key={item._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer"
                onClick={() => navigate(`/product/${item._id}`)}
              >
                <img
                  src={item.image || "https://via.placeholder.com/300"}
                  alt={item.name}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 h-14">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      Rs. {item.price?.toLocaleString()}
                    </p>
                    {item.countInStock > 0 ? (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        In Stock
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;