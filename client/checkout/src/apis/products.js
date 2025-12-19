import httpRequest from "../helper/httpMethods";
import { useProductStore } from "store/productStore";
import { useLoaderStore } from "store/loaderStore";

export const getProductByCategory = async (
  categoryid,
  filters = {
    sortBy: "newest",
  }
) => {
  useLoaderStore.getState().setLoading(true);
  try {
    const response = await httpRequest(
      "get",
      `/api/ecommerce/product-category/${categoryid}`,
      filters
    );
    if (response?.data && response?.status === 200) {
      useProductStore.setState((state) => ({
        ...state,
        productsByCategory: response.data,
      }));
    }
  } catch (error) {
    console.error("Error fetching products by category:", error);
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};

export const getProductById = async (productid) => {
  const response = await httpRequest(
    "get",
    `/api/ecommerce/product/${productid}`
  );
  useLoaderStore.getState().setLoading(true);
  try {
    if (response?.data && response?.status === 200) {
      useProductStore.setState((state) => ({
        ...state,
        product: response.data,
      }));
    }
  } catch (error) {
    console.error("Error fetching product by ID:", error);
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};
