import httpRequest from "../../helper/httpMethods";
import { useProductStore } from "store/productStore";
import { useLoaderStore } from "store/loaderStore";

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
  useLoaderStore.getState().setLoading(true);
  try {
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
  } catch (error) {
    console.error("Error fetching product categories:", error);
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};
