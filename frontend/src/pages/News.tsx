import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../api/news";

type Period = "day" | "week" | "month";

export default function News() {
  const [userId, setUserId] = useState<number>(1);
  const [period, setPeriod] = useState<Period>("day");
  const [selected, setSelected] = useState<number | null>(null);
  const [summary, setSummary] = useState<{ header: string; summary: string } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const getNews = useMutation({
    mutationFn: () => api.getNews({ user_id: userId, news_period: period }),
  });

  const getSummary = useMutation({
    mutationFn: (news_id: number) => api.getSummary({ news_id }),
    onSuccess: (data) => setSummary(data),
    onError: (e: any) => setErr(e?.response?.data?.message ?? "Summary failed"),
  });

  return (
    <div>
      <h2>News</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input type="number" min={1} value={userId} onChange={e=>setUserId(+e.target.value)} />
        <select value={period} onChange={e=>setPeriod(e.target.value as Period)}>
          <option value="day">day</option>
          <option value="week">week</option>
          <option value="month">month</option>
        </select>
        <button onClick={() => getNews.mutate()} disabled={getNews.isPending}>Load</button>
      </div>

      {getNews.isError && <p style={{color:"crimson"}}>Failed to load news</p>}
      {getNews.isSuccess && getNews.data.news.length === 0 && <p>No news</p>}

      <div style={{ display: "grid", gap: 12 }}>
        {getNews.data?.news.map(n => (
          <article key={n.news_id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
            <h3>{n.header}</h3>
            {n.img_url && <img src={n.img_url} style={{ maxWidth: 320, height: "auto" }} />}
            <p>{n.mini_description}</p>
            <button onClick={() => { setSelected(n.news_id); setSummary(null); getSummary.mutate(n.news_id); }}>
              Open summary
            </button>
          </article>
        ))}
      </div>

      {selected && (
        <div style={{ marginTop: 16, padding: 12, border: "1px solid #999", borderRadius: 8, background: "#fafafa" }}>
          <h4>Summary</h4>
          {getSummary.isPending && <p>Loading…</p>}
          {err && <p style={{ color: "crimson" }}>{err}</p>}
          {summary && (
            <>
              <strong>{summary.header}</strong>
              <p>{summary.summary}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
