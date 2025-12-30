import axiosInstance from "./adminApi";

export const registerUser = async (userData) => {
  const { data } = await axiosInstance.post("/auth/register", userData);
  return data;
};

export const loginUser = async (credentials) => {
  const { data } = await axiosInstance.post("/auth/login", credentials);
  return data;
};

export const getProfile = async () => {
  const { data } = await axiosInstance.get("/auth/profile");
  return data;
};
