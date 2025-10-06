import os
import logging
import time
import schedule
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

def job():
    try:
        postgres_url = os.getenv("POSTGRES_NEWS_URL")

        db = Database(postgres_url)
        fetcher = NewsFetcher()

        news_list = fetcher.fetch()
        if not news_list:
            logger.warning("No news fetched in this cycle")
            return

        db.insert_news(news_list)
        logger.info("Cycle finished: %d news items processed", len(news_list))

    except Exception as e:
        logger.error("Error in scheduled job: %s", e, exc_info=True)

def main():
    logger.info("Starting news aggregator with 5-minute scheduler")

    # schedule job every 5 minutes
    schedule.every(5).minutes.do(job)

    # run immediately at start
    job()

    while True:
        schedule.run_pending()
        time.sleep(1)

if __name__ == "__main__":
    main()
