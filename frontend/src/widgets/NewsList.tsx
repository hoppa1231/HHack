import type { News } from "../entities/news/model";
import NewsListItem from "../features/news/NewsListItem";

export default function NewsList({
  news,
  selectedId,
  onSelect,
}: {
  news: News[];
  selectedId?: number | null;
  onSelect?: (id: number) => void;
}) {
  return (
    <div className="space-y-5">
      {news.map((item, index) => (
        <NewsListItem
          key={item.id}
          item={item}
          index={index}
          selected={item.id === selectedId}
          onSelect={() => onSelect?.(item.id)}
        />
      ))}
    </div>
  );
}
