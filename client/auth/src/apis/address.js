export const saveNewAddress = (payload) => {
  if (payload) {
    let stringfyAddress = "";
    for (let value of Object.values(payload)) {
      stringfyAddress += value + ", ";
    }
    localStorage.setItem("address", JSON.stringify(stringfyAddress));
    return Promise.resolve({
      address: stringfyAddress,
      status: 200,
      message: "Saved Address",
    });
  }
  return Promise.reject({
    message: "",
    address: "",
    status: 404,
  });
};
