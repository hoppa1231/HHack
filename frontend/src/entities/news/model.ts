export type News = {
  id: string;
  title: string;
  summary: string;
  image: string;
  category: string;
  source?: string;
  publishedAt?: string; // ISO
};

export type Summary = {
  id: string;
  newsId: string;
  text: string;
};
