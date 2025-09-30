import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, News

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
)

class Database:
    def __init__(self, url: str):
        try:
            self.engine = create_engine(url)
            self.Session = sessionmaker(bind=self.engine)
            logger.info("Successfully connected to database: %s", url)
        except Exception as e:
            logger.error("Failed to connect to database: %s", e)
            raise

    def insert_news(self, news_list):
        session = self.Session()
        added_count = 0
        try:
            for news in news_list:
                exists = session.query(News).filter_by(link=news.link).first()
                if not exists:
                    session.add(news)
                    added_count += 1
            session.commit()
            logger.info("Inserted %d new articles", added_count)
        except Exception as e:
            session.rollback()
            logger.error("Error inserting news: %s", e)
            raise
        finally:
            session.close()
