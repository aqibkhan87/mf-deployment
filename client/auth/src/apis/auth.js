import httpRequest from "../helper/httpMethods.js";

export const login = async ({ contact, password }) => {
  return await httpRequest("post", `/api/auth/login`, {
    email: contact,
    password,
  });
};

export const signup = (data) => {
  const { email, password, firstName, lastName } = data;
  return httpRequest("post", `/api/auth/signup`, {
    email,
    password,
    firstName,
    lastName,
  });
};
