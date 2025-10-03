import { useProductStore } from "store/productStore";
import httpRequest from "../helper/httpMethods";

export const getAllProductsCategoryies = async () => {
  const query = `
  query getAllProductCategories {
    allCategories: getAllProductCategories {
      categoryid
      title
      products {
        _id
        actualPrice
        categoryid
        discountedPrice
        images
        name
        price
        productImage
        rating
        reviews
        seller
      }
    }
  }
`;
  const response = await httpRequest(
    "post",
    "/graphql",
    JSON.stringify({ query })
  );
  if (response?.data?.data && response?.status === 200) {
    useProductStore.setState((state) => ({
      ...state,
      allCategories: response.data?.data?.allCategories,
    }));
    return response.data;
  }
};
