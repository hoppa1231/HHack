import { http } from "./http";
import type { paths } from "./types.gen";

// типы из OpenAPI:
type NewsRequest = paths["/news"]["post"]["requestBody"]["content"]["application/json"];
type NewsResponse = paths["/news"]["post"]["responses"]["200"]["content"]["application/json"];

type SummaryRequest = paths["/summary"]["post"]["requestBody"]["content"]["application/json"];
type SummaryResponse = paths["/summary"]["post"]["responses"]["200"]["content"]["application/json"];

type RegisterReq = paths["/register"]["post"]["requestBody"]["content"]["application/json"];
type TokenResp = paths["/register"]["post"]["responses"]["200"]["content"]["application/json"];
type LoginReq = paths["/login"]["post"]["requestBody"]["content"]["application/json"];

export const api = {
  register: (data: RegisterReq) =>
    http.post<TokenResp>("/register", data).then(r => r.data),

  login: (data: LoginReq) =>
    http.post<TokenResp>("/login", data).then(r => r.data),

  getNews: (data: NewsRequest) =>
    http.post<NewsResponse>("/news", data).then(r => r.data),

  getSummary: (data: SummaryRequest) =>
    http.post<SummaryResponse>("/summary", data).then(r => r.data),
};
