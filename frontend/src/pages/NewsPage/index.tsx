import { useEffect, useMemo, useRef, useState } from "react";
import { Home, Search, Bell, User, List, ExternalLink, ChevronDown } from "lucide-react";
import NewsDeck from "../../widgets/NewsDeck";
import NewsList from "../../widgets/NewsList";
import PeriodSwitch from "../../widgets/PeriodSwitch";
import { useNewsQuery } from "../../features/news/useNewsQuery";
import { useNewsDetail } from "../../features/news/useNewsSummary";
import { useSourcesQuery } from "../../features/news/useSourcesQuery";
import type { Period } from "../../entities/news/model";
import type { News } from "../../entities/news/model";
import { NEWS_IMAGE_PLACEHOLDER } from "../../entities/news/model";
import type { NewsQuery, SourceInfo } from "../../api/news";

const ALL_CATEGORY = "Все";
const STORAGE_KEY = "news:selectedSources";

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

type SourceDropdownProps = {
  sources: SourceInfo[];
  selected: string[];
  onToggle: (name: string) => void;
  onSelectAll: () => void;
  allSelected: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
};

function SourceDropdown({
  sources,
  selected,
  onToggle,
  onSelectAll,
  allSelected,
  disabled = false,
  fullWidth = false,
}: SourceDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const toggleDropdown = () => {
    if (disabled) {
      return;
    }
    setOpen((prev) => !prev);
  };

  if (disabled) {
    return (
      <button
        type="button"
        className={`flex w-full items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/50`}
        disabled
      >
        No sources available
      </button>
    );
  }

  const summaryText = (() => {
    if (allSelected || sources.length === 0) {
      return "Все источники";
    }
    if (selected.length === 0) {
      return "Не выбрано источников";
    }
    if (selected.length <= 2) {
      return selected.join(", ");
    }
    return `${selected.length} источников`;
  })();

  const panelWidth = fullWidth ? "w-full" : "md:w-80";

  return (
    <div
      className={`relative z-[60] ${fullWidth ? "w-full" : "w-full md:w-auto"}`}
      ref={containerRef}
    >
      <button
        type="button"
        onClick={toggleDropdown}
        className={`flex w-full items-center justify-between rounded-full border px-4 py-2 text-sm transition ${
          open
            ? "border-white bg-white text-[#0a1433]"
            : "border-white/20 bg-white/5 text-white hover:bg-white/10"
        }`}
      >
        <span className="truncate text-left">{summaryText}</span>
        <ChevronDown
          size={18}
          className={`ml-3 shrink-0 transition-transform ${
            open ? "rotate-180 text-[#0a1433]" : "text-white/70"
          }`}
        />
      </button>

      {open && (
        <div
          className={`absolute left-0 right-0 z-[70] mt-3 rounded-3xl border border-white/15 bg-[#0a1433] p-4 shadow-xl backdrop-blur ${panelWidth}`}
        >
          <div className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2 text-sm text-white">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-white/30 bg-transparent text-[#3b82f6] focus:ring-[#3b82f6]"
                checked={allSelected}
                onChange={onSelectAll}
              />
              <span className="select-none font-medium">Все источники</span>
            </label>
            <button
              type="button"
              className="text-xs text-white/70 underline-offset-4 hover:text-white hover:underline"
              onClick={() => setOpen(false)}
            >
              Сохранить
            </button>
          </div>

          <div className="mt-4 max-h-64 space-y-1 overflow-y-auto pr-1">
            {sources.map((source) => {
              const checked = selected.includes(source.name);
              return (
                <label
                  key={source.name}
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2 transition hover:bg-white/10 ${
                    checked ? "bg-white/10" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-white/30 bg-transparent text-[#3b82f6] focus:ring-[#3b82f6]"
                    checked={checked}
                    onChange={() => onToggle(source.name)}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">
                      {source.name}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewsPage() {
  const [period, setPeriod] = useState<Period>("day");
  const [category, setCategory] = useState<string>(ALL_CATEGORY);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const sourcesQuery = useSourcesQuery();
  const allSourceNames = useMemo(
    () => sourcesQuery.data?.map((source) => source.name) ?? [],
    [sourcesQuery.data]
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return;
      }
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
        setSelectedSources(parsed);
      }
    } catch {
      // ignore localStorage parsing errors
    }
  }, []);
  useEffect(() => {
    if (!sourcesQuery.data || sourcesQuery.data.length === 0) {
      return;
    }

    setSelectedSources((prev) => {
      const available = new Set(allSourceNames);
      const filtered = prev.filter((name) => available.has(name));

      if (filtered.length > 0) {
        return filtered.length === prev.length ? prev : filtered;
      }

      const defaults = sourcesQuery.data
        .filter((source) => source.chosen)
        .map((source) => source.name);
      const initial = defaults.length > 0 ? defaults : allSourceNames;

      if (
        initial.length === prev.length &&
        initial.every((name) => prev.includes(name))
      ) {
        return prev;
      }

      return initial;
    });
  }, [sourcesQuery.data, allSourceNames]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedSources));
    } catch {
      // ignore storage errors
    }
  }, [selectedSources]);

  const allSourcesSelected =
    allSourceNames.length > 0 &&
    selectedSources.length === allSourceNames.length;

  const toggleSource = (name: string) => {
    setSelectedSources((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const selectAllSources = () => {
    if (allSourcesSelected || allSourceNames.length === 0) {
      setSelectedSources([]);
      return;
    }
    setSelectedSources([...allSourceNames]);
  };

  const totalSourceCount = allSourceNames.length;

  const filters = useMemo(() => {
    const params: NewsQuery = { period };
    if (category !== ALL_CATEGORY) {
      params.category = category;
    }
    if (
      selectedSources.length > 0 &&
      (totalSourceCount === 0 || selectedSources.length !== totalSourceCount)
    ) {
      params.sources = selectedSources;
    }
    return params;
  }, [period, category, selectedSources, totalSourceCount]);

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

        <div className="px-4 space-y-2">
          {sourcesQuery.isError && (
            <p className="text-xs text-rose-200">
              Failed to load sources filter.
            </p>
          )}
          {sourcesQuery.isLoading && !sourcesQuery.data && (
            <p className="text-xs text-white/60">Loading sources...</p>
          )}
          {!sourcesQuery.isError && (
            <SourceDropdown
              sources={sourcesQuery.data ?? []}
              selected={selectedSources}
              onToggle={toggleSource}
              onSelectAll={selectAllSources}
              allSelected={allSourcesSelected}
              disabled={(sourcesQuery.data ?? []).length === 0}
              fullWidth
            />
          )}
        </div>

        <div className="px-4 mt-2">
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
          <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-3 text-sm text-white/70">
              <div className="flex flex-wrap gap-3">
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
              {sourcesQuery.isError && (
                <p className="text-xs text-rose-200">Failed to load sources filter.</p>
              )}
              {sourcesQuery.isLoading && !sourcesQuery.data && (
                <p className="text-xs text-white/60">Loading sources...</p>
              )}
              {!sourcesQuery.isError && (
                <SourceDropdown
                  sources={sourcesQuery.data ?? []}
                  selected={selectedSources}
                  onToggle={toggleSource}
                  onSelectAll={selectAllSources}
                  allSelected={allSourcesSelected}
                  disabled={(sourcesQuery.data ?? []).length === 0}
                />
              )}
            </div>
            <div className="self-start">
              <PeriodSwitch value={period} onChange={setPeriod} />
            </div>
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
