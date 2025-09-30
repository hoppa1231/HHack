import os
import logging
from lib.db import Database
from fetcher.fetcher import NewsFetcher

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
)

REQUIRED_ENV_VARS = [
    "POSTGRES_NEWS_URL",
    "GIGA_AUTH_KEY",
    "GIGA_SCOPE"
]

missing_vars = [var for var in REQUIRED_ENV_VARS if not os.getenv(var)]
if missing_vars:
        raise EnvironmentError(f"Missing required environment variables: {', '.join(missing_vars)}")

def main():
    POSTGRES_URL = os.getenv("POSTGRES_NEWS_URL")

    db = Database(POSTGRES_URL)
    fetcher = NewsFetcher()

    news_list = fetcher.fetch()
    if not news_list:
        logger.warning("No news fetched from sources")
        return

    db.insert_news(news_list)
    logger.info("Service finished successfully")

if __name__ == "__main__":
    main()
