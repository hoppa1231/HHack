import os
import time
import psycopg2
import logging
from searcher_agent.searcher import graph 

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

REQUIRED_ENV_VARS = [
    "POSTGRES_NEWS_DB",
    "DATABASE_USER",
    "DATABASE_PASSWORD",
    "DATABASE_HOST",
    "DATABASE_PORT"
]

missing_vars = [var for var in REQUIRED_ENV_VARS if not os.getenv(var)]
if missing_vars:
    raise EnvironmentError(f"Missing required environment variables: {', '.join(missing_vars)}")

DSN = (
    f"dbname={os.environ['POSTGRES_NEWS_DB']} "
    f"user={os.environ['DATABASE_USER']} "
    f"password={os.environ['DATABASE_PASSWORD']} "
    f"host={os.environ['DATABASE_HOST']} "
    f"port={os.environ['DATABASE_PORT']}"
)

def get_unprocessed_news():
    query = "SELECT id, title, content FROM news WHERE news_resume IS NULL;"
    with psycopg2.connect(DSN) as conn, conn.cursor() as cur:
        cur.execute(query)
        return cur.fetchall()

def update_news_resume(news_id: int, resume: str):
    query = "UPDATE news SET news_resume = %s WHERE id = %s;"
    with psycopg2.connect(DSN) as conn, conn.cursor() as cur:
        cur.execute(query, (resume, news_id))
        conn.commit()

def main_loop():
    logger.info("News auto-update started (interval: 30 seconds)")
    while True:
        try:
            news_list = get_unprocessed_news()
            if not news_list:
                logger.info("No news items pending for update.")
            else:
                for news_id, title, content in news_list:
                    logger.info(f"Updating summary for news ID={news_id}")
                    resume_response = graph.invoke({"news_title": title, "news_content": content})
                    resume = resume_response.get("running_resume", "")
                    update_news_resume(news_id, resume)
                    time.sleep(2)  # avoid API overload

        except Exception as e:
            logger.error(f"Error in update loop: {e}")

        time.sleep(30)

if __name__ == "__main__":
    main_loop()
