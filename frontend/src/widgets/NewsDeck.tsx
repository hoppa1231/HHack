import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import FlipCard from "../features/news/FlipCard";
import NewsCard from "../features/news/NewsCard";
import type { News } from "../entities/news/model";
import Button from "../shared/ui/Button";
import { RotateCcw } from "lucide-react";

const sample: News[] = [
  {
    id: "1",
    title: "Слили фотографии Александра Фалеева",
    summary: `Интернет взорвался: в сеть «утекли» редкие кадры Александра Фалеева, легендарного автора книг о силовых тренировках и, по совместительству, главного философа качалки.
По неподтверждённым данным, снимки были сделаны в естественной среде обитания Фалеева — возле турника и чашки кофе. На фото он выглядит сурово, но загадочно, как человек, который только что отказался от жима лёжа ради долгих рассуждений о смысле жизни.
Очевидцы утверждают, что на некоторых кадрах Александр якобы держит в руках гантелю весом 1 кг — «для разминки мозга». А на другом фото он задумчиво смотрит на пустой зал, где эхо повторяет его знаменитую фразу: «Не надо страдать — тренируйтесь в кайф».
Эксперты уже сравнили эту утечку с «фитнес-версией» сливов архивов NASA: ценность информации велика, но понять её смогут только те, кто хотя бы раз пробовал приседать по Фалееву.
В комментариях к фото поклонники пишут:
— «Он не потеет, это железо плачет!»
— «Судя по лицу, он сейчас откроет новый философский трактат о тяге в наклоне».

По слухам, скоро появятся новые кадры, где Фалеев идёт в магазин за гречкой и внезапно начинает объяснять кассиру принцип суперкомпенсации.`,
    image:
      "https://chatgpt.com/backend-api/estuary/public_content/enc/eyJpZCI6Im1fNjhjZjE2YTQ5OTY0ODE5MTljZWEyMGYzYzk1MmVjZDM6ZmlsZV8wMDAwMDAwMDFjMGM2MjJmYmMyYjk3ZjM4NWNiYmJiOCIsInRzIjoiNDg4NDQ1IiwicCI6InB5aSIsImNpZCI6IjEiLCJzaWciOiI2MmIwZDU2MzM0ZTg0NTQ0NGFmODQwZDRjN2I3YTQ5Y2MxYjI2MWJmMzMyYWZhNmEyOWU1MDdkNTBlMzY5YjMxIiwidiI6IjAiLCJnaXptb19pZCI6bnVsbCwiY3AiOm51bGwsIm1hIjpudWxsfQ==",
    category: "Politics",
    source: "Grand News",
    publishedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "",
    summary: "The left-arm quick…",
    image:
      "https://chatgpt.com/backend-api/estuary/public_content/enc/eyJpZCI6Im1fNjhjZjE3YzY3Y2Q4ODE5MWJmYTgwNGM2MWMxMDY0YzQ6ZmlsZV8wMDAwMDAwMDA5ODQ2MjJmOWQwMjk0ZjQwM2VlNjE4MCIsInRzIjoiNDg4NDQ1IiwicCI6InB5aSIsImNpZCI6IjEiLCJzaWciOiIxODc4MDVmMDRiNTY1NTNlYjFhODY5OGNmNDc5NmZiZDE4MGJhYjMyNGUwNzEwMGE0NDBlNGUyMzVlM2UxNDMyIiwidiI6IjAiLCJnaXptb19pZCI6bnVsbCwiY3AiOm51bGwsIm1hIjpudWxsfQ==",
    category: "Sports",
    source: "The Herald",
    publishedAt: new Date(Date.now() - 3600_000).toISOString(),
  },
  {
    id: "3",
    title: "How San Francisco’s Wealthiest Families launched Kamala Harris",
    summary: "A network of donors…",
    image:
      "https://images.unsplash.com/photo-1509098681029-b45e9c845022?q=80&w=1600&auto=format&fit=crop",
    category: "Politics",
    source: "SF Chronicle",
    publishedAt: new Date(Date.now() - 7200_000).toISOString(),
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
                  <div className="p-5">
                    <h3 className="text-lg font-bold leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                </div>
              }
            />
          ))}
        </AnimatePresence>

        {cursor >= (news ?? []).length && (
          <div className="absolute inset-0 rounded-3xl bg-white/5 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
            <p className="text-white/80">На этом все</p>
            <Button onClick={reset} className="flex items-center gap-2">
              <RotateCcw size={16} />
              Пересмотреть
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
