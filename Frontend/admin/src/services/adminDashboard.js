import adminApi from "./adminApi";


export const getDashboardStats = async () => {
  try {
    const { data } = await adminApi.get("/admin/dashboard-stats");
    return {
      users: data.usersCount,
      orders: data.ordersCount,
      products: data.productsCount,
    };
  } catch (err) {
    console.error("Failed to load dashboard stats:", err);
    return {
      users: 0,
      orders: 0,
      products: 0,
    };
  }
};

export const getRecentOrders = async () => {
  const { data } = await adminApi.get("/admin/orders");
  return data;
};

export const getTopProducts = async () => {
  const { data } = await adminApi.get("/admin/products");
  return data;
};
