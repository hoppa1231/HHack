from typing import List, Optional

from sqlalchemy import nullslast
from sqlalchemy.exc import SQLAlchemyError

from app.models import News
from app.schemas import NewsDetail, NewsItem, NewsQueryParams


def _seed_urls(prefix: str, count: int = 20) -> List[str]:
    return [f"https://picsum.photos/seed/{prefix}-{i}/1200/800" for i in range(1, count + 1)]


CATEGORY_PLACEHOLDERS = {
    "политика": _seed_urls("politics"),
    "экономика": _seed_urls("economy"),
    "спорт": _seed_urls("sports"),
    "технологии": _seed_urls("technology"),
    "IT": _seed_urls("it"),
    "культура": _seed_urls("culture"),
    "наука": _seed_urls("science"),
    "здоровье": _seed_urls("health"),
    "развлечения": _seed_urls("entertainment"),
    "другое": _seed_urls("general"),
}

GENERIC_PLACEHOLDERS = _seed_urls("generic")


def _pick_placeholder(pool: List[str], index: int) -> str:
    if not pool:
        return GENERIC_PLACEHOLDERS[index % len(GENERIC_PLACEHOLDERS)]
    return pool[index % len(pool)]


class NewsService:
    def get_news(self, params: NewsQueryParams) -> List[NewsItem]:
        query = News.query.order_by(
            nullslast(News.published.desc()),
            News.id.desc(),
        )

        if params.category:
            query = query.filter(News.category == params.category)

        if params.sources:
            query = query.filter(News.source.in_(params.sources))

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
                image=row.image_url or self._image_for(row.category, idx),
                description=row.description,
                link=row.link,
            )
            for idx, row in enumerate(rows)
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
            image=row.image_url or self._image_for(row.category, 0),
            description=row.description,
            link=row.link,
        )

    def get_sources(self) -> List[dict]:
        feeds = []
        try:
            from lib.sources import NewsSource

            feeds = NewsSource().feeds
        except ModuleNotFoundError:
            feeds = []
        except Exception:
            feeds = []

        try:
            db_sources = {
                value
                for (value,) in News.query.with_entities(News.source)
                .filter(News.source.isnot(None))
                .distinct()
                .all()
                if value
            }
        except SQLAlchemyError:
            db_sources = set()

        result = [
            {"name": feed.name, "chosen": feed.chosen, "available": feed.name in db_sources}
            for feed in feeds
        ]

        extra = [
            {"name": source, "chosen": True, "available": True}
            for source in sorted(db_sources - {feed.name for feed in feeds})
        ]

        return result + extra

    def _image_for(self, category: Optional[str], index: int) -> str:
        if category and category in CATEGORY_PLACEHOLDERS:
            return _pick_placeholder(CATEGORY_PLACEHOLDERS[category], index)
        return _pick_placeholder(GENERIC_PLACEHOLDERS, index)
