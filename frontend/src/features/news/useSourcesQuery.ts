import { useQuery } from "@tanstack/react-query";

import { fetchSources, type SourceInfo } from "../../api/news";

export function useSourcesQuery() {
  return useQuery<SourceInfo[]>({
    queryKey: ["sources"],
    queryFn: fetchSources,
  });
}
