import axios from "axios";
import { VITE_API_BASE_URL } from "../config";

export const http = axios.create({
  baseURL: VITE_API_BASE_URL,
  timeout: 15000,
});

http.interceptors.response.use(
  (r) => r,
  (err) => {
    const msg = err?.response?.data?.message || err.message || "Request failed";
    const status = err?.response?.status;
    return Promise.reject(Object.assign(new Error(msg), { status }));
  }
);
