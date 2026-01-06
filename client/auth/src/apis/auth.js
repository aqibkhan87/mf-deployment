import httpRequest from "../helper/httpMethods";
import { useLoaderStore } from "store/loaderStore";

export const login = async ({ contact, password }) => {
  useLoaderStore.getState().setLoading(true);
  try {
    return await httpRequest("post", `/api/auth/login`, {
      email: contact,
      password,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return error?.response?.data
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};

export const signup = (data) => {
  const { email, password, firstName, lastName } = data;
  useLoaderStore.getState().setLoading(true);
  try {
    return httpRequest("post", `/api/auth/signup`, {
      email,
      password,
      firstName,
      lastName,
    });
  } catch (error) {
    console.error("Error during signup:", error);
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};
