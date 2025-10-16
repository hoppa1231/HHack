import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import FlipCard from "../features/news/FlipCard";
import NewsCard from "../features/news/NewsCard";
import type { News } from "../entities/news/model";
import Button from "../shared/ui/Button";
import { RotateCcw, ExternalLink } from "lucide-react";
import { NEWS_IMAGE_PLACEHOLDER } from "../entities/news/model";

const sample: News[] = [
  {
    id: 1,
    title: "Обзор событий в политике",
    summary:
      "Коротко о том, как развиваются ключевые политические события и почему это важно.",
    image: NEWS_IMAGE_PLACEHOLDER,
    category: "политика",
    source: "Grand News",
    publishedAt: new Date().toISOString(),
    link: "https://example.com/news/1",
  },
  {
    id: 2,
    title: "Экономика ускоряется",
    summary:
      "Предприниматели отмечают повышение деловой активности, а аналитики ждут обновления прогнозов.",
    image: NEWS_IMAGE_PLACEHOLDER,
    category: "экономика",
    source: "The Herald",
    publishedAt: new Date(Date.now() - 3600_000).toISOString(),
    link: "https://example.com/news/2",
  },
  {
    id: 3,
    title: "Наука готовит прорыв",
    summary:
      "Международная группа исследователей сообщила о подготовке новой миссии, которая должна дать ответ на давний вопрос.",
    image: NEWS_IMAGE_PLACEHOLDER,
    category: "наука",
    source: "SF Chronicle",
    publishedAt: new Date(Date.now() - 7200_000).toISOString(),
    link: "https://example.com/news/3",
  },
];

export default function NewsDeck({ news = sample }: { news?: News[] }) {
  const [cursor, setCursor] = useState(0);
  const visible = useMemo(
    () => (news ?? []).slice(cursor, cursor + 3),
    [news, cursor]
  );

  const swipe = () =>
    setCursor((current) => Math.min(current + 1, (news ?? []).length));
  const reset = () => setCursor(0);

  return (
    <div className="px-4">
      <div className="relative mx-auto aspect-[2/3] w-full max-w-[360px]">
        <AnimatePresence initial={false}>
          {visible.map((item, index) => (
            <FlipCard
              key={item.id}
              index={index}
              onSwipe={swipe}
              front={<NewsCard item={item} />}
              back={
                <div className="h-full w-full overflow-y-auto rounded-3xl bg-white dark:bg-slate-900">
                  <div className="space-y-4 p-5">
                    <div>
                      <h3 className="text-lg font-bold leading-snug">
                        {item.title}
                      </h3>
                      <ReactMarkdown
                        className="markdown-body mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 [&>p:first-child]:mt-0 [&>*>a]:text-sky-600 [&>*>a:hover]:text-sky-500 [&>ol]:list-decimal [&>ol]:pl-5 [&>ul]:list-disc [&>ul]:pl-5"
                        components={{
                          a: ({ node, ...props }) => (
                            <a
                              {...props}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(event) => event.stopPropagation()}
                            />
                          ),
                        }}
                      >
                        {item.resume ?? item.summary}
                      </ReactMarkdown>
                    </div>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-500"
                      >
                        Читать в источнике
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              }
            />
          ))}
        </AnimatePresence>

        {cursor >= (news ?? []).length && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-3xl bg-white/5 backdrop-blur-sm">
            <p className="text-white/80">Лента обновлена</p>
            <Button onClick={reset} className="flex items-center gap-2">
              <RotateCcw size={16} />
              Посмотреть снова
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
