import type { News } from "../entities/news/model";
import NewsListItem from "../features/news/NewsListItem";

export default function NewsList({
  news,
  onSelect,
}: {
  news: News[];
  onSelect?: (id: number) => void;
}) {
  return (
    <div className="px-5 mt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-extrabold">Последние новости</h3>
        <a className="text-xs text-white/70" href="#">
          Смотреть все
        </a>
      </div>
      <div className="mt-3 space-y-3 pb-28">
        {news.map((n) => (
          <NewsListItem key={n.id} item={n} onSelect={() => onSelect?.(n.id)} />
        ))}
      </div>
    </div>
  );
}

