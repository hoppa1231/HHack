import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import FlipCard from "../features/news/FlipCard";
import NewsCard from "../features/news/NewsCard";
import type { News } from "../entities/news/model";
import Button from "../shared/ui/Button";
import { RotateCcw, ExternalLink } from "lucide-react";
import { NEWS_IMAGE_PLACEHOLDER } from "../entities/news/model";

const sample: News[] = [
  {
    id: 1,
    title: "Пример новости о политике",
    summary:
      "Короткий текст о том, как команда объединила данные из разных источников и воспользовалась новой аналитической платформой.",
    image: NEWS_IMAGE_PLACEHOLDER,
    category: "Политика",
    source: "Grand News",
    publishedAt: new Date().toISOString(),
    link: "https://example.com/news/1",
  },
  {
    id: 2,
    title: "Стартап запускает революционный продукт",
    summary:
      "Компания представила решение на основе ИИ, которое помогает редакциям ускорить подготовку материалов и анализ аудитории.",
    image: NEWS_IMAGE_PLACEHOLDER,
    category: "Технологии",
    source: "The Herald",
    publishedAt: new Date(Date.now() - 3600_000).toISOString(),
    link: "https://example.com/news/2",
  },
  {
    id: 3,
    title: "Крупный спортивный турнир завершился сенсацией",
    summary:
      "Финал соревнований завершился неожиданным результатом, а болельщики обсуждают новую стратегию команды-победителя.",
    image: NEWS_IMAGE_PLACEHOLDER,
    category: "Спорт",
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

  const swipe = () => setCursor((c) => Math.min(c + 1, (news ?? []).length));
  const reset = () => setCursor(0);

  return (
    <div className="px-4">
      <div className="relative w-full max-w-[360px] aspect-[2/3] mx-auto">
        <AnimatePresence initial={false}>
          {visible.map((item, i) => (
            <FlipCard
              key={item.id}
              index={i}
              onSwipe={swipe}
              front={<NewsCard item={item} />}
              back={
                <div className="h-full w-full rounded-3xl bg-white dark:bg-slate-900 overflow-y-auto">
                  <div className="p-5 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                        {item.resume ?? item.summary}
                      </p>
                    </div>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-500"
                      >
                        Перейти к источнику
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
          <div className="absolute inset-0 rounded-3xl bg-white/5 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
            <p className="text-white/80">Лента закончилась</p>
            <Button onClick={reset} className="flex items-center gap-2">
              <RotateCcw size={16} />
              Начать заново
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
