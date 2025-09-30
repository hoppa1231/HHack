from yoyo import read_migrations, get_backend
import logging
import os

DATABASE_URL = os.environ.get("POSTGRES_NEWS_URL")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MIGRATIONS_PATH = os.path.join(BASE_DIR, "migrations")

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
)

def apply_migrations():
    try:
        backend = get_backend(DATABASE_URL)
        migrations = read_migrations(MIGRATIONS_PATH)
        logger.info("Применение миграций из %s", MIGRATIONS_PATH)
        logger.debug("Миграции: %s", migrations)
        with backend.lock():
            backend.apply_migrations(backend.to_apply(migrations))
        logger.info("Миграции успешно применены")
    except Exception as e:
        logger.exception(f"Ошибка при применении миграций: {e}")
        raise
