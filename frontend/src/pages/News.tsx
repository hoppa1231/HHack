import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../api/news";
import type { Period, NewsDetail, News } from "../entities/news/model";

export default function News() {
  const [period, setPeriod] = useState<Period>("day");
  const [category, setCategory] = useState<string>("");
  const [detail, setDetail] = useState<NewsDetail | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const getNews = useMutation<News[]>({
    mutationFn: () =>
      api.fetchNews({
        period,
        category: category || undefined,
      }),
  });

  const getSummary = useMutation<NewsDetail, unknown, number>({
    mutationFn: (newsId: number) => api.fetchNewsDetail(newsId),
    onSuccess: (data) => {
      setDetail(data);
      setErr(null);
    },
    onError: (e: any) => {
      setErr(e?.response?.data?.detail ?? "Не удалось получить описание");
    },
  });

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: 24 }}>
      <h2>Новости</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <select value={period} onChange={(e) => setPeriod(e.target.value as Period)}>
          <option value="day">За день</option>
          <option value="week">За неделю</option>
          <option value="month">За месяц</option>
        </select>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Категория"
        />
        <button onClick={() => getNews.mutate()} disabled={getNews.isPending}>
          Загрузить
        </button>
      </div>

      {getNews.isError && <p style={{ color: "crimson" }}>Не удалось загрузить список</p>}
      {getNews.isSuccess && getNews.data?.length === 0 && <p>Нет новостей по фильтрам</p>}

      <div style={{ display: "grid", gap: 12 }}>
        {getNews.data?.map((n) => (
          <article key={n.id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
            <h3>{n.title}</h3>
            <p>{n.summary}</p>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button onClick={() => getSummary.mutate(n.id)}>Открыть</button>
              {n.link && (
                <a href={n.link} target="_blank" rel="noopener noreferrer">
                  Читать в источнике
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      {detail && (
        <div style={{ marginTop: 16, padding: 12, border: "1px солид #999", borderRadius: 8, background: "#fafafa" }}>
          <h4>{detail.title}</h4>
          <p>{detail.content ?? detail.summary}</p>
          {detail.link && (
            <p style={{ marginTop: 8 }}>
              <a href={detail.link} target="_blank" rel="noopener noreferrer">
                Открыть источник
              </a>
            </p>
          )}
        </div>
      )}
      {err && <p style={{ color: "crimson" }}>{err}</p>}
    </div>
  );
}
