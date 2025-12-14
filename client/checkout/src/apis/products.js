import httpRequest from "../helper/httpMethods";
import { useProductStore } from "store/productStore";

export const getProductByCategory = async (
  categoryid,
  filters = {
    sortBy: "newest",
  }
) => {
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
};

export const getProductById = async (productid) => {
  const response = await httpRequest(
    "get",
    `/api/ecommerce/product/${productid}`
  );
  if (response?.data && response?.status === 200) {
    useProductStore.setState((state) => ({
      ...state,
      product: response.data,
    }));
  }
};
