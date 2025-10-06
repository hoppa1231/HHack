from typing import List, Optional

from sqlalchemy import nullslast

from app.models import News
from app.schemas import NewsDetail, NewsItem, NewsQueryParams

CATEGORY_PLACEHOLDERS = {
    "политика": "https://images.unsplash.com/photo-1521543836029-819f06c44736?auto=format&fit=crop&w=1200&q=80",
    "экономика": "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
    "спорт": "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=1200&q=80",
    "технологии": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    "IT": "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80",
    "культура": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    "наука": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    "здоровье": "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1200&q=80",
    "развлечения": "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=1200&q=80",
    "другое": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
}
DEFAULT_IMAGE = CATEGORY_PLACEHOLDERS["другое"]


class NewsService:
    def get_news(self, params: NewsQueryParams) -> List[NewsItem]:
        query = News.query.order_by(nullslast(News.published.desc()), News.id.desc())

        if params.category:
            query = query.filter(News.category == params.category)

        cutoff = params.cutoff()
        if cutoff:
            query = query.filter(News.published >= cutoff)

        rows = query.limit(params.limit).all()
        return [
            NewsItem(
                id=row.id,
                title=row.title,
                summary=row.summary(),
                category=row.category,
                source=row.source,
                published_at=row.published or row.created_at,
                image=self._image_for(row.category),
                link=row.link,
            )
            for row in rows
        ]

    def get_detail(self, news_id: int) -> NewsDetail:
        row = News.query.get(news_id)
        if row is None:
            raise LookupError("News item not found")

        return NewsDetail(
            id=row.id,
            title=row.title,
            summary=row.summary(600),
            content=row.content,
            category=row.category,
            source=row.source,
            published_at=row.published or row.created_at,
            image=self._image_for(row.category),
            link=row.link,
        )

    def _image_for(self, category: Optional[str]) -> str:
        if not category:
            return DEFAULT_IMAGE
        return CATEGORY_PLACEHOLDERS.get(category, DEFAULT_IMAGE)


