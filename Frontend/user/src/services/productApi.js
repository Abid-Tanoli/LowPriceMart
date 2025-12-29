import axiosInstance from "./api";

export const getProducts = async (page = 1, limit = 10, category = "") => {
  try {
    let url = `/products?page=${page}&limit=${limit}`;

    if (category) {
      url += `&category=${encodeURIComponent(category)}`;
    }

    const { data } = await axiosInstance.get(url);

    if (!data || !data.docs) {
      console.error("Invalid response format:", data);
      return {
        docs: [],
        totalPages: 1,
        currentPage: 1,
        totalDocs: 0
      };
    }

    const normalizedData = {
      ...data,
      docs: data.docs.map((product) => ({
        ...product,
        countInStock: Number(product.stock ?? 0), 
      })),
    };

    return normalizedData;
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      docs: [],
      totalPages: 1,
      currentPage: 1,
      totalDocs: 0
    };
  }
};

export const getProductById = async (id) => {
  try {
    const { data } = await axiosInstance.get(`/products/${id}`);
    return {
      ...data,
      countInStock: Number(data.stock ?? 0)
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const getRelatedProducts = async (id) => {
  try {
    const { data } = await axiosInstance.get(`/products/related/${id}`);
    return data.map(product => ({
      ...product,
      countInStock: Number(product.stock ?? 0)
    }));
  } catch (error) {
    console.error("Error fetching related products:", error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  const { data } = await axiosInstance.post("/products", productData);
  return data;
};

export const updateProduct = async (id, updatedData) => {
  const { data } = await axiosInstance.put(`/products/${id}`, updatedData);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await axiosInstance.delete(`/products/${id}`);
  return data;
};