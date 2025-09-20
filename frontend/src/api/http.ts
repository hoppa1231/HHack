import axios from "axios";
import { auth } from "../shared/auth";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

http.interceptors.request.use((config) => {
  const token = auth.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
