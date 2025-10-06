import { useEffect, useMemo, useState } from "react";
import { Home, Search, Bell, User, List, ExternalLink } from "lucide-react";
import NewsDeck from "../../widgets/NewsDeck";
import NewsList from "../../widgets/NewsList";
import PeriodSwitch from "../../widgets/PeriodSwitch";
import { useNewsQuery } from "../../features/news/useNewsQuery";
import { useNewsDetail } from "../../features/news/useNewsSummary";
import type { Period } from "../../entities/news/model";
import type { News } from "../../entities/news/model";
import { NEWS_IMAGE_PLACEHOLDER } from "../../entities/news/model";
import type { NewsQuery } from "../../api/news";

const ALL_CATEGORY = "All";

type MobileCardProps = {
  item: News;
  onSelect: () => void;
};

function MobileNewsCard({ item, onSelect }: MobileCardProps) {
  const imageSrc = item.image ?? NEWS_IMAGE_PLACEHOLDER;
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full overflow-hidden rounded-3xl bg-white/5 text-left backdrop-blur-sm"
    >
      <img
        src={imageSrc}
        alt="cover"
        className="h-48 w-full object-cover"
      />
      <div className="space-y-2 px-5 py-4">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">
          {item.category}
        </p>
        <h3 className="text-lg font-semibold leading-snug text-white">
          {item.title}
        </h3>
        <p className="text-sm text-white/70 line-clamp-3">
          {item.summary}
        </p>
        {item.link && (
          <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-sky-300">
            Источник
            <ExternalLink size={14} />
          </span>
        )}
      </div>
    </button>
  );
}

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
    <div className="min-h-screen bg-[#070f24] text-white">
      <div className="md:hidden">
        <header className="px-5 pt-6 pb-3 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-white/60">Дневная сводка</p>
            <h1 className="text-2xl font-extrabold tracking-tight">Grand News</h1>
          </div>
          <div className="flex items-center gap-3 opacity-80">
            <List size={22} />
            <User size={22} />
          </div>
        </header>

        <div className="px-4 pb-3 overflow-x-auto no-scrollbar">
          <div className="flex gap-6 text-sm">
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

        <div className="px-4">
          <PeriodSwitch value={period} onChange={setPeriod} />
        </div>

        <section className="px-4">
          <NewsDeck news={items} />
        </section>
        
        
        <section className="px-4 mt-6 space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
            <h2 className="text-lg font-semibold mb-2">Сводка</h2>
            {detail.isLoading && <p className="text-sm text-white/70">Loading…</p>}
            {detail.isError && (
              <p className="text-sm text-rose-200">Failed to fetch summary.</p>
            )}
            {detail.data && (
              <div className="space-y-3">
                <h3 className="text-base font-semibold leading-snug">
                  {detail.data.title}
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  {detail.data.content ?? detail.data.summary}
                </p>
                {detail.data.link && (
                  <a
                    href={detail.data.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 hover:text-sky-200"
                  >
                    Источник
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            )}
            {!detail.data && !detail.isLoading && !detail.isError && (
              <p className="text-sm text-white/70">Select a story below to read the summary.</p>
            )}
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <MobileNewsCard
                key={item.id}
                item={item}
                onSelect={() => setSelectedId(item.id)}
              />
            ))}
          </div>
        </section>

        <nav className="mt-8 flex items-center justify-around border-t border-white/10 bg-[#08102a] px-6 py-4 text-white/70">
          <button className="flex flex-col items-center text-white">
            <Home size={20} />
            <span className="text-[10px] mt-1">Home</span>
          </button>
          <button className="flex flex-col items-center">
            <Search size={20} />
            <span className="text-[10px] mt-1">Search</span>
          </button>
          <button className="flex flex-col items-center">
            <Bell size={20} />
            <span className="text-[10px] mt-1">Alerts</span>
          </button>
          <button className="flex flex-col items-center">
            <User size={20} />
            <span className="text-[10px] mt-1">Profile</span>
          </button>
        </nav>
      </div>

      <div className="hidden md:block">
        <header className="border-b border-white/10 bg-[#0a1433]">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">Дневная сводка</p>
              <h1 className="text-3xl font-extrabold tracking-tight">Grand News</h1>
            </div>
            <div className="flex items-center gap-6 text-white/70">
              <List size={26} />
              <User size={26} />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-8 space-y-8">
          <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-3 text-sm text-white/70">
              {categories.map((value) => (
                <button
                  key={value}
                  onClick={() => setCategory(value)}
                  className={`rounded-full px-4 py-2 transition ${
                    category === value ? "bg-white text-[#0a1433]" : "bg-white/10 hover:bg-white/15"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            <PeriodSwitch value={period} onChange={setPeriod} />
          </section>

          <section className="flex flex-col gap-8 lg:flex-row">
            <div className="flex-1 space-y-6">
              {newsQuery.isError && (
                <div className="rounded-2xl border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                  Failed to load news. Try reloading the page.
                </div>
              )}
              <NewsList news={items} selectedId={selectedId} onSelect={setSelectedId} />
            </div>

            {/* <aside className="w-full max-w-xl space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h2 className="text-xl font-semibold">Summary</h2>
              {detail.isLoading && <p className="text-sm text-white/70">Loading…</p>}
              {detail.isError && (
                <p className="text-sm text-rose-200">Failed to fetch summary.</p>
              )}
              {detail.data && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                      {detail.data.category}
                    </p>
                    <h3 className="text-2xl font-semibold leading-tight">
                      {detail.data.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-white/70">
                    {detail.data.content ?? detail.data.summary}
                  </p>
                  {detail.data.link && (
                    <a
                      href={detail.data.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 hover:text-sky-200"
                    >
                      Open source
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              )}
              {!detail.data && !detail.isLoading && !detail.isError && (
                <p className="text-sm text-white/70">Select an article from the list to see its summary.</p>
              )}
            </aside> */}
          </section>
        </main>

        <footer className="border-t border-white/10 bg-[#08102a]">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-10 py-5 text-white/70">
            <button className="flex flex-col items-center gap-1 text-white">
              <Home size={22} />
              <span className="text-[11px] uppercase tracking-[0.3em]">Home</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <Search size={22} />
              <span className="text-[11px] uppercase tracking-[0.3em]">Search</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <Bell size={22} />
              <span className="text-[11px] uppercase tracking-[0.3em]">Alerts</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <User size={22} />
              <span className="text-[11px] uppercase tracking-[0.3em]">Profile</span>
            </button>
          </nav>
        </footer>
      </div>
    </div>
  );
}
