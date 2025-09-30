import feedparser
import datetime
import logging
from bs4 import BeautifulSoup
from lib.models import News, NewsCategory
from lib.sources import RSS_FEEDS
from categorizer_agent.categorizer import categorize_news

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
)

class NewsFetcher:
    def __init__(self, feeds=None):
        self.feeds = feeds or RSS_FEEDS
        logger.info("NewsFetcher initialized with %d sources", len(self.feeds))

    def clean_html(self, raw_html: str) -> str:
        return BeautifulSoup(raw_html, "html.parser").get_text()

    def fetch(self):
        news_list = []
        for source, url in self.feeds.items():
            try:
                logger.info("Fetching from %s", source)
                feed = feedparser.parse(url)
                for entry in feed.entries:
                    published = None
                    if hasattr(entry, "published_parsed") and entry.published_parsed:
                        try:
                            published = datetime.datetime(*entry.published_parsed[:6])
                        except Exception:
                            published = None

                    news_title = getattr(entry, "title", "")
                    news_link = getattr(entry, "link", "")
                    news_content = self.clean_html(getattr(entry, "summary", ""))
                    
                    news_category = categorize_news(news_title + " " + news_content[:512], news_link)

                    news = News(
                        title=news_title,
                        link=news_link,
                        source=source,
                        published=published or datetime.datetime.utcnow(),
                        content=news_content,
                        category=NewsCategory(news_category) if news_category in NewsCategory.__members__ else NewsCategory.другое,
                    )
                    news_list.append(news)
                logger.info("Fetched %d articles from %s", len(feed.entries), source)
            except Exception as e:
                logger.error("Error while fetching from %s: %s", source, e)

        logger.info("Total fetched: %d articles", len(news_list))
        return news_list
