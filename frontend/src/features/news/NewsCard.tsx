import type { News } from "../../entities/news/model";
import { formatDate } from "../../entities/news/lib";

export default function NewsCard({
  item,
}: {
  item: News;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl">
      <img
        src={item.image}
        alt={item.title}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4 space-y-2">
        <h2 className="text-white text-xl font-extrabold leading-snug drop-shadow">
          {item.title}
        </h2>
        <p className="text-white/80 text-xs">
          {item.source} - {formatDate(item.publishedAt)}
        </p>
      </div>
    </div>
  );
}
