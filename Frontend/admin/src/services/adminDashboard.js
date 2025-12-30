import adminApi from "./adminApi";

export const getDashboardStats = async () => {
  const { data } = await adminApi.get("/dashboard-stats");
  return data;
};

export const getRecentOrders = async () => {
  const { data } = await adminApi.get("/orders/recent");
  return data;
};

export const getTopProducts = async () => {
  const { data } = await adminApi.get("/products/top");
  return data;
};
