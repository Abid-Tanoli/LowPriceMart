import adminApi from "./adminApi";

/**
 * Get products with pagination + search
 */
export const getProducts = async (page = 1, search = "") => {
  const { data } = await adminApi.get(
    `/admin/products?page=${page}&search=${search}`
  );

  return data;
};

/**
 * Delete product
 */
export const deleteProduct = async (id) => {
  await adminApi.delete(`/admin/product/${id}`);
};

/**
 * Update product
 */
export const updateProduct = async (id, payload) => {
  await adminApi.put(`/admin/product/${id}`, payload);
};

/**
 * Create product
 */
export const createProduct = async (payload) => {
  await adminApi.post("/admin/product", payload);
};
