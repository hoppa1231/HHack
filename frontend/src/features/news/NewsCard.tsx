import type { News } from "../../entities/news/model";
import { NEWS_IMAGE_PLACEHOLDER } from "../../entities/news/model";
import { formatDate } from "../../entities/news/lib";
import { ExternalLink } from "lucide-react";

export default function NewsCard({ item }: { item: News }) {
  const imageSrc = item.image ?? NEWS_IMAGE_PLACEHOLDER;
  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl">
      <img
        src={imageSrc}
        alt={item.title}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4 space-y-2">
        <h2 className="text-white text-xl font-extrabold leading-snug drop-shadow">
          {item.title}
        </h2>
        <p className="text-white/80 text-xs">
          {item.source}
          {item.publishedAt ? ` - ${formatDate(item.publishedAt)}` : ""}
        </p>
        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-white/20 hover:bg-white/30 rounded-lg px-3 py-1.5 backdrop-blur"
          >
            Читать в источнике
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
}
