import axios from "axios";
import { API_TIMEOUT, API_URL } from "../config";

const api = axios.create({
    baseURL: API_URL,
    timeout: API_TIMEOUT,
    headers: {
        "Content-Type": "application/json"
    }
});

export default api;