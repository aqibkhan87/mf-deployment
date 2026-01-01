import axiosInstance from './axiosInstance';


const httpRequest = async (method, url="", data = null, config = {}) => {
  try {
    const BASE_URL = process.env.API_BASE_URL || "http://localhost:4000";
    const options = {
      method: method.toLowerCase(),
      url: BASE_URL + url,
      ...config,
    };

    if (['post', 'put', 'patch'].includes(method.toLowerCase())) {
      options.data = data;
    } else if (method.toLowerCase() === 'get' && data) {
      options.params = data;
    }

    return await axiosInstance(options);
  } catch (error) {
    console.error(`Error in ${method} ${url}:`, error);
    throw error;
  }
};

export default httpRequest;
