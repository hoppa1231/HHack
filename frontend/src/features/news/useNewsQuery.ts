import { useQuery } from "@tanstack/react-query";
import { fetchNews, type NewsQuery } from "../../api/news";
import type { News } from "../../entities/news/model";

export function useNewsQuery(params?: NewsQuery) {
  return useQuery<News[]>({
    queryKey: ["news", params],
    queryFn: () => fetchNews(params),
  });
}

