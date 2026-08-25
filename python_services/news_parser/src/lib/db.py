import logging
from collections.abc import Sequence

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from lib.models import News

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
)

class Database:
    def __init__(self, url: str) -> None:
        try:
            self.engine = create_engine(url, pool_pre_ping=True)
            self.Session = sessionmaker(bind=self.engine)
            logger.info("Database engine initialized")
        except Exception:
            logger.exception("Failed to initialize database engine")
            raise

    def insert_news(self, news_list: Sequence[News]) -> int:
        added_count = 0
        with self.Session() as session:
            try:
                for news in news_list:
                    exists = session.query(News.id).filter_by(link=news.link).first()
                    if not exists:
                        session.add(news)
                        added_count += 1
                session.commit()
                logger.info("Inserted %d new articles", added_count)
            except Exception:
                session.rollback()
                logger.exception("Failed to insert news batch")
                raise
        return added_count
