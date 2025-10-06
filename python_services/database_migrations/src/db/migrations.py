import logging
import os
from pathlib import Path
from urllib.parse import urlparse

import psycopg2
from psycopg2 import sql
from yoyo import get_backend, read_migrations

logger = logging.getLogger(__name__)

DATABASE_URL = os.environ.get("POSTGRES_NEWS_URL")
ADMIN_DATABASE_URL = os.environ.get("POSTGRES_ADMIN_URL")

BASE_DIR = Path(__file__).resolve().parent.parent
MIGRATIONS_PATH = BASE_DIR / "database_migrations"


def ensure_database_exists() -> None:
    if not ADMIN_DATABASE_URL:
        raise EnvironmentError("POSTGRES_ADMIN_URL is not set")
    if not DATABASE_URL:
        raise EnvironmentError("POSTGRES_NEWS_URL is not set")

    parsed = urlparse(DATABASE_URL)
    db_name = parsed.path.lstrip("/")
    if not db_name:
        raise ValueError("POSTGRES_NEWS_URL must include a database name")

    owner = parsed.username
    admin_conn = psycopg2.connect(ADMIN_DATABASE_URL)
    admin_conn.autocommit = True
    try:
        with admin_conn.cursor() as cur:
            cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (db_name,))
            if cur.fetchone():
                logger.info("Database %s already exists", db_name)
                return

            if owner:
                cur.execute(
                    sql.SQL("CREATE DATABASE {} OWNER {};").format(
                        sql.Identifier(db_name),
                        sql.Identifier(owner),
                    )
                )
            else:
                cur.execute(
                    sql.SQL("CREATE DATABASE {};").format(sql.Identifier(db_name))
                )
            logger.info("Created database %s", db_name)
    finally:
        admin_conn.close()


def apply_migrations() -> None:
    try:
        ensure_database_exists()
        backend = get_backend(DATABASE_URL)
        migrations = read_migrations(str(MIGRATIONS_PATH))
        logger.info("Applying migrations from %s", MIGRATIONS_PATH)
        with backend.lock():
            backend.apply_migrations(backend.to_apply(migrations))
        logger.info("Migrations applied successfully")
    except Exception as exc:
        logger.exception("Failed to apply migrations: %s", exc)
        raise

