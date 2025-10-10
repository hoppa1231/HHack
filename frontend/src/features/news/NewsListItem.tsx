import type { KeyboardEvent } from "react";
import { ExternalLink } from "lucide-react";
import type { News } from "../../entities/news/model";
import { NEWS_IMAGE_PLACEHOLDER } from "../../entities/news/model";
import { formatDate } from "../../entities/news/lib";

export default function NewsListItem({
  item,
  index,
  selected,
  onSelect,
}: {
  item: News;
  index: number;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const imageSrc = item.image ?? NEWS_IMAGE_PLACEHOLDER;
  const imageFirst = index % 2 === 0;

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
      className={`group flex flex-col md:flex-row ${imageFirst ? "md:flex-row" : "md:flex-row-reverse"} gap-6 items-stretch rounded-3xl border border-white/10 bg-white/5 hover:bg-white/7 transition backdrop-blur px-4 py-4 md:px-6 md:py-5 focus:outline-none focus:ring-2 focus:ring-white/50 ${selected ? "ring-2 ring-sky-300" : ""}`}
    >
      <div className="md:w-60 w-full max-h-[250px] overflow-hidden rounded-2xl shadow-lg">
        <img
          src={imageSrc}
          data-debug={imageSrc}
          alt={item.title}
          className="w-full h-auto max-h-[250px] object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex-1 flex flex-col justify-between min-w-0 space-y-3">
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-[0.2em] text-white/60">
            {item.category}
          </div>
          <h3 className="text-xl font-semibold leading-tight text-white line-clamp-2">
            {item.title}
          </h3>
          <p className="text-sm leading-relaxed text-white/70 line-clamp-3">
            {item.resume ?? item.summary}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-white/60">
          <span>
            {item.source}
            {item.publishedAt ? ` • ${formatDate(item.publishedAt)}` : ""}
          </span>
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 hover:text-sky-200"
            >
              Источник
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
