import axiosInstance from "./api";

export const getWishlist = async () => {
  try {
    const { data } = await axiosInstance.get("/wishlist");
    return data;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return { products: [] };
  }
};

export const addToWishlist = async (productId) => {
  const { data } = await axiosInstance.post("/wishlist/add", { productId });
  return data;
};

export const removeFromWishlist = async (productId) => {
  const { data } = await axiosInstance.delete(`/wishlist/${productId}`);
  return data;
};
