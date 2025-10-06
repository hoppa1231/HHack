import { http } from "../shared/api/http";
import type { News, NewsDetail, Period } from "../entities/news/model";

export type NewsQuery = {
  category?: string;
  period?: Period;
  limit?: number;
};

export type RegisterPayload = {
  name: string;
  password: string;
  preferences: string[];
};

export type LoginPayload = {
  name: string;
  password: string;
};

export type TokenResponse = {
  access_token: string;
};

export const fetchNews = (params?: NewsQuery) =>
  http.get<News[]>("/news", { params }).then((r) => r.data);

export const fetchNewsDetail = (id: number) =>
  http.get<NewsDetail>(`/news/${id}`).then((r) => r.data);

export const register = (payload: RegisterPayload) =>
  http.post<TokenResponse>("/register", payload).then((r) => r.data);

export const login = (payload: LoginPayload) =>
  http.post<TokenResponse>("/login", payload).then((r) => r.data);

export const api = {
  register,
  login,
  fetchNews,
  fetchNewsDetail,
};

