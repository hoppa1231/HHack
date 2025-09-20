import type { News } from "../../entities/news/model";
import { formatDate } from "../../entities/news/lib";

export default function NewsListItem({ item }: { item: News }) {
  return (
    <div className="w-full bg-white/5 rounded-2xl p-3 flex gap-3 items-start backdrop-blur-sm">
      <img
        src={item.image}
        alt="thumb"
        className="w-16 h-16 object-cover rounded-xl"
      />
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-white/70">
          {item.category}
        </div>
        <div className="text-sm font-semibold leading-snug line-clamp-2">
          {item.title}
        </div>
        <div className="text-[11px] text-white/60 mt-1">
          {item.source} • {formatDate(item.publishedAt)}
        </div>
      </div>
    </div>
  );
}
