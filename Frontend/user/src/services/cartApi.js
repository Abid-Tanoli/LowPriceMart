import api from "./api";

export const getCart = async () => {
  const { data } = await api.get("/cart");
  return Array.isArray(data) ? data[0] : data;
};

export const addToCart = async (productId, qty = 1) => {
  const { data } = await api.post("/cart/add", { productId, qty });
  return data;
};

export const updateCartItem = async (productId, qty) => {
  const { data } = await api.put(`/cart/${productId}`, { qty });
  return data;
};

export const removeFromCart = async (productId) => {
  const { data } = await api.delete(`/cart/${productId}`);
  return data;
};

export const clearCart = async () => {
  const { data } = await api.delete("/cart/clear");
  return data;
};
