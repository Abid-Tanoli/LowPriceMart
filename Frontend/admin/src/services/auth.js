import axiosInstance from "./adminApi";

export const registerUser = async (userData) => {
  const { data } = await axiosInstance.post("/api/auth/register", userData);
  return data;
};

export const loginUser = async (credentials) => {
  const { data } = await axiosInstance.post("/api/auth/login", credentials);
  return data;
};

export const getProfile = async () => {
  const { data } = await axiosInstance.get("/api/auth/profile");
  return data;
};
