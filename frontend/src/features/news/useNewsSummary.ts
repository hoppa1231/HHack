import { useQuery } from "@tanstack/react-query";
import { http } from "../../shared/api/http";
import type { Summary } from "../../entities/news/model";

export function useSummary(newsId: string) {
  return useQuery<Summary>({
    queryKey: ["summary", newsId],
    enabled: !!newsId,
    queryFn: async () => {
      const { data } = await http.get<Summary>(`/summary/${newsId}`);
      return data;
    },
  });
}
