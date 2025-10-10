import feedparser
import datetime
import logging
from bs4 import BeautifulSoup
from lib.models import News, NewsCategory
from lib.sources import NewsSource
from categorizer_agent.categorizer import categorize_news
# from ranker_agent.score_ranker import score_news
from .extract_image import extract_image_url_from_enclosures
# from searcher_agent.searcher import graph

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
)

class NewsFetcher:
    def __init__(self, feeds=None):
        if feeds is None:
            news_source = NewsSource()
            self.feeds = news_source.get_feed_urls()
        else:
            self.feeds = feeds
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
                    news_description = getattr(entry, "description", "")
                    news_image = extract_image_url_from_enclosures(entry) or ""

                    news_content = self.clean_html(getattr(entry, "summary", ""))
                    
                    logger.info("Starting categorization...")
                    news_category = categorize_news(news_title + " " + news_content[:512], news_link)
                    # logger.info("Starting resume generating...")
                    # news_resume = graph.invoke({"news_title": news_title, 'news_content': news_content})
                    # logger.info(f"Generated resume: {news_resume}")
                    # logger.info("Starting news scoring...")
                    # news_score = score_news(news_title + " " + news_content, news_link)

                    news = News(
                        title=news_title,
                        link=news_link,
                        source=source,
                        published=published or datetime.datetime.utcnow(),
                        content=news_content,
                        # news_resume=news_description or news_content,
                        image_url=news_image,
                        description=news_description,
                        category=NewsCategory(news_category) if news_category in NewsCategory.__members__ else NewsCategory.другое,
                        created_at=datetime.datetime.utcnow(),
                        # news_score = news_score
                    )

                    news_list.append(news)
                logger.info("Fetched %d articles from %s", len(feed.entries), source)
            except Exception as e:
                logger.error("Error while fetching from %s: %s", source, e)

        logger.info("Total fetched: %d articles", len(news_list))
        return news_list
    
