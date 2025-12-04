import api from "../services/api";


export const createOrder = async (orderData) => {
  const { data } = await api.post("/orders", orderData);
  return data;
};


export const getOrders = async () => {
  const { data } = await api.get("/orders/myorders");
  return data;
};

export const getOrderById = async (id) => {
  const { data } = await api.get(`/orders/${id}`);
  return data;
};