import { useMemo, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Bookmark, Share2, Home, Search, Bell, User, RotateCcw, List } from "lucide-react";

// ---------- Types ----------
export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  image: string;
  category: string;
  source?: string;
  publishedAt?: string; // ISO string
};

export type NewsDeckProps = {
  news?: NewsItem[];
  categories?: string[];
  initialCategory?: string;
  onSwipe?: (newsId: string, direction: "left" | "right") => void;
  onBookmark?: (newsId: string) => void;
  onShare?: (newsId: string) => void;
};

// ---------- Helpers ----------
const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "";

const sampleNews: NewsItem[] = [
  {
    id: "1",
    title: "Obama Foundation draws high dollar; international donations",
    summary:
      "New York — At Montana Gov. Steve Bullock stood on the steps of the capitol, a wave of second donors fueled a historic fund-raising drive, signaling a broader turning towards global impact.",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1600&auto=format&fit=crop",
    category: "Politics",
    source: "Grand News",
    publishedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Starc fires back at England despite injury setback",
    summary:
      "The left-arm quick returned to the attack and rattled the top order, setting up a thrilling finish in the day-night test.",
    image:
      "https://images.unsplash.com/photo-1521417531039-70730fbb15ae?q=80&w=1600&auto=format&fit=crop",
    category: "Sports",
    source: "The Herald",
    publishedAt: new Date(Date.now() - 3600_000).toISOString(),
  },
  {
    id: "3",
    title: "How San Francisco’s Wealthiest Families launched Kamala Harris",
    summary:
      "A network of donors and strategists supported the meteoric rise, reshaping the state’s political landscape.",
    image:
      "https://images.unsplash.com/photo-1509098681029-b45e9c845022?q=80&w=1600&auto=format&fit=crop",
    category: "Politics",
    source: "SF Chronicle",
    publishedAt: new Date(Date.now() - 7200_000).toISOString(),
  },
  {
    id: "4",
    title: "Modi to visit White House June 26",
    summary:
      "The Indian Prime Minister will meet with leaders and tech CEOs to discuss supply chains and AI collaboration.",
    image:
      "https://images.unsplash.com/photo-1520975603465-8d07aba97e5a?q=80&w=1600&auto=format&fit=crop",
    category: "World",
    source: "Reuters",
    publishedAt: new Date(Date.now() - 86400_000).toISOString(),
  },
];

// ---------- Card component (with swipe + flip) ----------
function SwipeFlipCard({
  item,
  onSwipe,
  onBookmark,
  onShare,
  index,
}: {
  item: NewsItem;
  onSwipe: (dir: "left" | "right") => void;
  onBookmark?: () => void;
  onShare?: () => void;
  index: number; // 0 = top
}) {
  const [flipped, setFlipped] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-12, 0, 12]);
  const opacity = useTransform(x, [-220, 0, 220], [0, 1, 0]);

  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    const threshold = 130;
    if (info.offset.x > threshold) onSwipe("right");
    else if (info.offset.x < -threshold) onSwipe("left");
  };

  return (
    <motion.div
      className="absolute inset-0 origin-center will-change-transform"
      style={{ zIndex: 50 - index }}
      initial={{ scale: 1 - index * 0.04, y: index * 12 }}
      animate={{ scale: 1 - index * 0.04, y: index * 12 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.div
        className="h-full rounded-3xl shadow-xl bg-white dark:bg-slate-900 relative overflow-hidden"
        style={{ rotate, x, opacity, transformStyle: "preserve-3d" as any }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        onTap={() => setFlipped((f) => !f)}
      >
        {/* FRONT */}
        <motion.div
          className="absolute inset-0 backface-hidden"
          style={{ WebkitBackfaceVisibility: "hidden" as any, backfaceVisibility: "hidden" as any }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="h-full w-full flex flex-col">
            <div className="relative h-2/3">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute top-4 left-4 text-xs uppercase tracking-wider px-2 py-1 rounded-full bg-white/90 text-slate-900 font-semibold">
                {item.category}
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-white text-xl font-extrabold leading-snug drop-shadow">
                  {item.title}
                </h2>
                <p className="text-white/80 text-xs mt-1">
                  {item.source} • {formatDate(item.publishedAt)}
                </p>
              </div>
            </div>
            <div className="h-1/3 p-4 flex items-center justify-between">
              <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
                {item.summary}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare?.();
                  }}
                  className="p-2 rounded-full bg-slate-100 dark:bg-slate-800"
                  aria-label="Share"
                >
                  <Share2 size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookmark?.();
                  }}
                  className="p-2 rounded-full bg-slate-100 dark:bg-slate-800"
                  aria-label="Bookmark"
                >
                  <Bookmark size={18} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* BACK (details) */}
        <motion.div
          className="absolute inset-0 backface-hidden bg-white dark:bg-slate-900 rounded-3xl p-5 overflow-y-auto"
          style={{
            transform: "rotateY(180deg)",
            WebkitBackfaceVisibility: "hidden" as any,
            backfaceVisibility: "hidden" as any,
          }}
          animate={{ rotateY: flipped ? 360 : 180 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-bold leading-snug">{item.title}</h3>
          <p className="text-xs text-slate-500 mt-1">
            {item.source} • {formatDate(item.publishedAt)} • {item.category}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
            {item.summary}
          </p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare?.();
              }}
              className="px-3 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-sm"
            >
              <Share2 className="inline mr-1" size={16} /> Share
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBookmark?.();
              }}
              className="px-3 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-sm"
            >
              <Bookmark className="inline mr-1" size={16} /> Save
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ---------- Main Component ----------
export default function NewsDeck({
  news = sampleNews,
  categories,
  initialCategory = "All",
  onSwipe,
  onBookmark,
  onShare,
}: NewsDeckProps) {
  const allCategories = useMemo(() => {
    const base = ["All", ...(categories ?? Array.from(new Set(news.map((n) => n.category))))];
    return Array.from(new Set(base));
  }, [categories, news]);

  const [activeCat, setActiveCat] = useState<string>(initialCategory);
  const filtered = useMemo(
    () => (activeCat === "All" ? news : news.filter((n) => n.category === activeCat)),
    [activeCat, news]
  );
  const [cursor, setCursor] = useState(0); // index in filtered

  const visible = filtered.slice(cursor, cursor + 3);

  const swipe = (dir: "left" | "right") => {
    const item = filtered[cursor];
    if (!item) return;
    onSwipe?.(item.id, dir);
    setCursor((c) => Math.min(c + 1, filtered.length));
  };

  const reset = () => setCursor(0);

  return (
    <div className="w-[390px] max-w-full min-h-screen mx-auto bg-[#0a1433] text-white relative overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-6 pb-3 flex items-center justify-between">
        <div className="text-2xl font-extrabold tracking-tight">Grand News</div>
        <div className="flex items-center gap-3 opacity-80">
          <List size={22} />
          <User size={22} />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 pb-3 overflow-x-auto no-scrollbar">
        <div className="flex gap-8 text-sm">
          {allCategories.map((c) => (
            <button
              key={c}
              onClick={() => {
                setActiveCat(c);
                setCursor(0);
              }}
              className={`pb-2 transition border-b-2 ${
                activeCat === c ? "border-white" : "border-transparent text-white/70"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Card Deck */}
      <div className="px-4">
        <div className="relative h-[520px]">
          <AnimatePresence initial={false}>
            {visible.map((item, i) => (
              <SwipeFlipCard
                key={item.id}
                item={item}
                index={i}
                onSwipe={(d) => swipe(d)}
                onBookmark={() => onBookmark?.(item.id)}
                onShare={() => onShare?.(item.id)}
              />
            ))}
          </AnimatePresence>
          {cursor >= filtered.length && (
            <div className="absolute inset-0 rounded-3xl bg-white/5 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
              <p className="text-white/80">No more cards in {activeCat}</p>
              <button
                onClick={reset}
                className="px-3 py-2 rounded-xl bg-white text-slate-900 text-sm font-semibold flex items-center gap-2"
              >
                <RotateCcw size={16} /> Restart deck
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Latest list (scrollable) */}
      <div className="px-5 mt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold">Latest News</h3>
          <a className="text-xs text-white/70" href="#">See more</a>
        </div>
        <div className="mt-3 space-y-3 pb-28">
          {news.slice(0, 8).map((n) => (
            <div
              key={`list-${n.id}`}
              className="w-full bg-white/5 rounded-2xl p-3 flex gap-3 items-start backdrop-blur-sm"
            >
              <img src={n.image} alt="thumb" className="w-16 h-16 object-cover rounded-xl" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-white/70">{n.category}</div>
                <div className="text-sm font-semibold leading-snug line-clamp-2">{n.title}</div>
                <div className="text-[11px] text-white/60 mt-1">
                  {n.source} • {formatDate(n.publishedAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 w-[390px] max-w-full mx-auto bg-[#08102a] border-t border-white/10 px-8 py-3 flex items-center justify-between rounded-t-2xl">
        <button className="flex flex-col items-center text-white">
          <Home size={22} />
          <span className="text-[10px] mt-1">Home</span>
        </button>
        <button className="flex flex-col items-center text-white/70">
          <Search size={22} />
          <span className="text-[10px] mt-1">Search</span>
        </button>
        <button className="flex flex-col items-center text-white/70">
          <Bell size={22} />
          <span className="text-[10px] mt-1">Alerts</span>
        </button>
        <button className="flex flex-col items-center text-white/70">
          <User size={22} />
          <span className="text-[10px] mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
}
