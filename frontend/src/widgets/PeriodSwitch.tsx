type Period = "day" | "week" | "month";

const labels: Record<Period, string> = {
  day: "День",
  week: "Неделя",
  month: "Месяц",
};
export default function PeriodSwitch({
  value,
  onChange,
}: {
  value: Period;
  onChange: (p: Period) => void;
}) {
  const items: Period[] = ["day", "week", "month"];
  return (
    <div className="px-4 py-2 flex gap-2">
      {items.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-3 py-1 rounded-full text-sm ${
            value === p ? "bg-white text-slate-900" : "bg-white/10 text-white"
          }`}
        >
          {labels[p]}
        </button>
      ))}
    </div>
  );
}
