import axiosInstance from './axiosInstance.js';  // your configured axios

/**
 * Generic API request method
 * 
 * @param {string} method - HTTP method ('GET', 'POST', 'PUT', 'DELETE')
 * @param {string} url - API endpoint URL
 * @param {object} [data] - Request payload for POST/PUT
 * @param {object} [config] - Additional Axios config (headers, params, etc.)
 * @returns {Promise} Axios response promise
 */
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
      // Pass data as query params for GET requests if data provided
      options.params = data;
    }

    return await axiosInstance(options);
  } catch (error) {
    // Handle or rethrow error as needed
    console.error(`Error in ${method} ${url}:`, error);
    throw error;
  }
};

export default httpRequest;
