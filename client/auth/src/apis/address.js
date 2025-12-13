import httpRequest from "../helper/httpMethods";

export const addNewAddress = async (payload) => {
  const userId = JSON.parse(localStorage.getItem("user"))?._id || "";
  return await httpRequest(
    "post",
    `/api/addresses/add?userId=${userId}`,
    JSON.stringify(payload)
  );
};
