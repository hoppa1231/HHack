import { useEffect, useMemo, useState } from "react";
import { Home, Search, Bell, User, List, ExternalLink } from "lucide-react";
import NewsDeck from "../../widgets/NewsDeck";
import NewsList from "../../widgets/NewsList";
import PeriodSwitch from "../../widgets/PeriodSwitch";
import { useNewsQuery } from "../../features/news/useNewsQuery";
import { useNewsDetail } from "../../features/news/useNewsSummary";
import type { Period } from "../../entities/news/model";
import type { NewsQuery } from "../../api/news";

const ALL_CATEGORY = "Все";

export default function NewsPage() {
  const [period, setPeriod] = useState<Period>("day");
  const [category, setCategory] = useState<string>(ALL_CATEGORY);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filters = useMemo(() => {
    const params: NewsQuery = { period };
    if (category !== ALL_CATEGORY) {
      params.category = category;
    }
    return params;
  }, [period, category]);

  const newsQuery = useNewsQuery(filters);
  const items = newsQuery.data ?? [];

  useEffect(() => {
    if (items.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !items.some((item) => item.id === selectedId)) {
      setSelectedId(items[0].id);
    }
  }, [items, selectedId]);

  const categories = useMemo(() => {
    const values = Array.from(new Set(items.map((item) => item.category)));
    return [ALL_CATEGORY, ...values];
  }, [items]);

  const detail = useNewsDetail(selectedId);

  return (
    <div className="w-[390px] max-w-full min-h-screen mx-auto bg-[#0a1433] text-white relative overflow-hidden">
      <div className="px-5 pt-6 pb-3 flex items-center justify-between">
        <div className="text-2xl font-extrabold tracking-tight">Grand News</div>
        <div className="flex items-center gap-3 opacity-80">
          <List size={22} />
          <User size={22} />
        </div>
      </div>

      <div className="px-4 pb-3 overflow-x-auto no-scrollbar">
        <div className="flex gap-8 text-sm">
          {categories.map((value) => (
            <button
              key={value}
              onClick={() => setCategory(value)}
              className={`pb-2 transition border-b-2 ${
                category === value ? "border-white" : "border-transparent text-white/70"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <PeriodSwitch value={period} onChange={setPeriod} />

      <section className="mt-4">
        <NewsDeck news={items} />
      </section>

      <section className="px-5 mt-6">
        <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-sm min-h-[140px] space-y-3">
          <h3 className="text-lg font-semibold">Сводка</h3>
          {detail.isLoading && <p className="text-white/70 text-sm">Загрузка...</p>}
          {detail.isError && (
            <p className="text-rose-300 text-sm">Не удалось загрузить описание новости.</p>
          )}
          {detail.data && (
            <>
              <h4 className="text-sm font-semibold">{detail.data.title}</h4>
              <p className="text-white/70 text-sm leading-relaxed">
                {detail.data.content ?? detail.data.summary}
              </p>
              {detail.data.link && (
                <a
                  href={detail.data.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 hover:text-sky-200"
                >
                  Открыть источник
                  <ExternalLink size={16} />
                </a>
              )}
            </>
          )}
        </div>
      </section>

      <NewsList
        news={items}
        onSelect={(id) => setSelectedId(id)}
      />

      <nav className="fixed bottom-0 left-0 right-0 w-[390px] max-w-full mx-auto bg-[#08102a] border-t border-white/10 px-8 py-3 flex items-center justify-between rounded-t-2xl">
        <button className="flex flex-col items-center text-white">
          <Home size={22} />
          <span className="text-[10px] mt-1">Главная</span>
        </button>
        <button className="flex flex-col items-center text-white/70">
          <Search size={22} />
          <span className="text-[10px] mt-1">Поиск</span>
        </button>
        <button className="flex flex-col items-center text-white/70">
          <Bell size={22} />
          <span className="text-[10px] mt-1">Уведомл.</span>
        </button>
        <button className="flex flex-col items-center text-white/70">
          <User size={22} />
          <span className="text-[10px] mt-1">Профиль</span>
        </button>
      </nav>
    </div>
  );
}
