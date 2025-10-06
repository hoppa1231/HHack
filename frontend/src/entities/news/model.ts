export type News = {
  id: number;
  title: string;
  summary: string;
  category: string;
  source: string;
  publishedAt?: string;
  image?: string | null;
  link?: string | null;
};

export type NewsDetail = News & {
  content?: string | null;
};

export type Period = "day" | "week" | "month";

export const NEWS_IMAGE_PLACEHOLDER =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80";
