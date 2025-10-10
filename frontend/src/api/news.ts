import { http } from "../shared/api/http";
import type { News, NewsDetail, Period } from "../entities/news/model";

export type NewsQuery = {
  category?: string;
  period?: Period;
  limit?: number;
  sources?: string[];
};

export type CategoryType = 
  | 'политика' 
  | 'экономика' 
  | 'спорт' 
  | 'технологии' 
  | 'культура' 
  | 'наука' 
  | 'здоровье' 
  | 'развлечения' 
  | 'другое';

export type RegisterPayload = {
  name: string;
  password: string;
  preferences: string[];
};

export type LoginPayload = {
  name: string;
  password: string;
  preferences: CategoryType[];
};

export type TokenResponse = {
  access_token: string;
};

export const fetchNews = (params?: NewsQuery) =>
  http
    .get<News[]>("/news", {
      params: params
        ? {
            ...params,
            sources:
              params.sources && params.sources.length > 0
                ? params.sources.join(",")
                : undefined,
          }
        : undefined,
    })
    .then((r) => r.data);

export const fetchNewsDetail = (id: number) =>
  http.get<NewsDetail>(`/news/${id}`).then((r) => r.data);

export type SourceInfo = {
  name: string;
  chosen: boolean;
  available: boolean;
};

export const fetchSources = () =>
  http.get<SourceInfo[]>("/sources").then((r) => r.data);

export const register = (payload: RegisterPayload) =>
  http.post<TokenResponse>("/register", payload).then((r) => r.data);

export const login = (payload: LoginPayload) =>
  http.post<TokenResponse>("/login", payload).then((r) => r.data);

export const api = {
  register,
  login,
  fetchNews,
  fetchNewsDetail,
  fetchSources,
};

