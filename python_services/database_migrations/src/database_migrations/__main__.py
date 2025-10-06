from db.migrations import apply_migrations
import logging
import os

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
)

REQUIRED_ENV_VARS = [
    "POSTGRES_NEWS_URL",
    "POSTGRES_ADMIN_URL",
]

missing_vars = [var for var in REQUIRED_ENV_VARS if not os.getenv(var)]
if missing_vars:
    raise EnvironmentError(f"Missing required environment variables: {', '.join(missing_vars)}")

if __name__ == "__main__":
    try:
        apply_migrations()
    except Exception:
        logger.exception("Migrations stopped with error")
        raise

