import { useQuery } from "@tanstack/react-query";
import { http } from "../../shared/api/http";
import type { News } from "../../entities/news/model";

export function useNewsQuery(params?: {
  category?: string;
  period?: "day" | "week" | "month";
}) {
  return useQuery<News[]>({
    queryKey: ["news", params?.category, params?.period],
    queryFn: async () => {
      const { data } = await http.get<News[]>("/news", { params });
      return data;
    },
  });
}
