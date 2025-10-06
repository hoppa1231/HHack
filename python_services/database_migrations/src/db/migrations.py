import logging
import os
from yoyo import get_backend, read_migrations

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MIGRATIONS_PATH = os.path.join(BASE_DIR, "database_migrations")

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
)

DATABASE_URL = os.environ.get("POSTGRES_NEWS_URL")

def apply_migrations() -> None:
    try:
        backend = get_backend(DATABASE_URL)
        migrations = read_migrations(str(MIGRATIONS_PATH))
        logger.info("Applying migrations from %s", MIGRATIONS_PATH)
        with backend.lock():
            backend.apply_migrations(backend.to_apply(migrations))
        logger.info("Migrations applied successfully")
    except Exception as exc:
        logger.exception("Failed to apply migrations: %s", exc)
        raise

