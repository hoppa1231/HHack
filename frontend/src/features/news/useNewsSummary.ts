import { useQuery } from "@tanstack/react-query";
import { fetchNewsDetail } from "../../api/news";
import type { NewsDetail } from "../../entities/news/model";

export function useNewsDetail(newsId?: number | null) {
  return useQuery<NewsDetail>({
    queryKey: ["news-detail", newsId],
    enabled: !!newsId,
    queryFn: () => fetchNewsDetail(newsId as number),
  });
}

