import adminApi from "./adminApi";

export const getDashboardStats = async () => {
  const { data } = await adminApi.get("/dashboard-stats");
  return data;
};
