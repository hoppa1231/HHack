from python_services.database_migrations.src.db.migrations import apply_migrations
import logging
import os

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

REQUIRED_ENV_VARS = [
    "POSTGRES_NEWS_URL",
]

missing_vars = [var for var in REQUIRED_ENV_VARS if not os.getenv(var)]
if missing_vars:
        raise EnvironmentError(f"Missing required environment variables: {', '.join(missing_vars)}")


if __name__ == "__main__":
    try:
        apply_migrations()
        
    except Exception as e:
        logger.error(f"Migrations stopped with error: {e}")
