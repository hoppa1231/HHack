import type { KeyboardEvent } from "react";
import type { News } from "../../entities/news/model";
import { NEWS_IMAGE_PLACEHOLDER } from "../../entities/news/model";
import { formatDate } from "../../entities/news/lib";
import { ExternalLink } from "lucide-react";

export default function NewsListItem({
  item,
  onSelect,
}: {
  item: News;
  onSelect?: () => void;
}) {
  const imageSrc = item.image ?? NEWS_IMAGE_PLACEHOLDER;
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect?.();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      className="w-full bg-white/5 rounded-2xl p-3 flex gap-3 items-start backdrop-blur-sm text-left hover:bg-white/8 transition focus:outline-none focus:ring-2 focus:ring-white/40"
    >
      <img
        src={imageSrc}
        alt="thumb"
        className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
      />
      <div className="flex-1 min-w-0 space-y-1">
        <div className="text-[10px] uppercase tracking-wider text-white/70">
          {item.category}
        </div>
        <div className="text-sm font-semibold leading-snug line-clamp-2 text-white">
          {item.title}
        </div>
        <div className="text-[11px] text-white/60">
          {item.source}
          {item.publishedAt ? ` • ${formatDate(item.publishedAt)}` : ""}
        </div>
        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="inline-flex items-center gap-1 text-[11px] text-sky-300 hover:text-sky-200"
          >
            Читать в источнике
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
}
