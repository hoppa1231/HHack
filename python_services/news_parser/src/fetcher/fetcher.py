import datetime
import logging
from collections.abc import Mapping

import feedparser
from bs4 import BeautifulSoup

from categorizer_agent.categorizer import categorize_news
from .extract_image import extract_image_url_from_enclosures
from lib.models import News, NewsCategory
from lib.sources import NewsSource

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
)

class NewsFetcher:
    def __init__(self, feeds: Mapping[str, str] | None = None) -> None:
        if feeds is None:
            news_source = NewsSource()
            self.feeds = news_source.get_feed_urls()
        else:
            self.feeds = feeds
        logger.info("NewsFetcher initialized with %d sources", len(self.feeds))

    @staticmethod
    def clean_html(raw_html: str) -> str:
        return BeautifulSoup(raw_html, "html.parser").get_text(" ", strip=True)

    def fetch(self) -> list[News]:
        news_list: list[News] = []
        for source, url in self.feeds.items():
            try:
                logger.info("Fetching from %s", source)
                feed = feedparser.parse(url)
                if getattr(feed, "bozo", False):
                    logger.warning(
                        "Feed %s reported a parsing warning: %s",
                        source,
                        getattr(feed, "bozo_exception", "unknown error"),
                    )
                for entry in feed.entries:
                    published = None
                    if hasattr(entry, "published_parsed") and entry.published_parsed:
                        try:
                            published = datetime.datetime(
                                *entry.published_parsed[:6],
                                tzinfo=datetime.timezone.utc,
                            )
                        except (TypeError, ValueError):
                            published = None

                    news_title = getattr(entry, "title", "")
                    news_link = getattr(entry, "link", "")
                    news_description = getattr(entry, "description", "")
                    news_image = extract_image_url_from_enclosures(entry) or ""

                    news_content = self.clean_html(getattr(entry, "summary", ""))
                    
                    logger.info("Starting categorization...")
                    news_category = categorize_news(
                        f"{news_title} {news_content[:512]}",
                        news_link,
                    )
                    # logger.info("Starting resume generating...")
                    # news_resume = graph.invoke({"news_title": news_title, 'news_content': news_content})
                    # logger.info(f"Generated resume: {news_resume}")
                    # logger.info("Starting news scoring...")
                    # news_score = score_news(news_title + " " + news_content, news_link)

                    news = News(
                        title=news_title,
                        link=news_link,
                        source=source,
                        published=published or datetime.datetime.now(datetime.timezone.utc),
                        content=news_content,
                        # news_resume=news_description or news_content,
                        image_url=news_image,
                        description=news_description,
                        category=NewsCategory(news_category),
                        created_at=datetime.datetime.now(datetime.timezone.utc),
                        # news_score = news_score
                    )

                    news_list.append(news)
                logger.info("Fetched %d articles from %s", len(feed.entries), source)
            except Exception:
                logger.exception("Failed to process feed %s", source)

        logger.info("Total fetched: %d articles", len(news_list))
        return news_list
    
