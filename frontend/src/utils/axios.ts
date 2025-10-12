import axios from "axios";
import { API_TIMEOUT, API_URL } from "../config";

const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response)
        alert(error.response.data.error)

    // return { data: null, error: true, status: error.response?.status };
  }
);

export default api;