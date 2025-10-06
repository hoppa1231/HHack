# Production Dockerfile for database_migrations service
FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    POETRY_NO_INTERACTION=1 \
    POETRY_VENV_IN_PROJECT=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache \
    PYTHONPATH='/app/services/database_migrations/src'

RUN apt-get update && apt-get install -y \
    git \
    curl \
    build-essential \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN pip install poetry==2.1.0

WORKDIR /app

COPY python_services/database_migrations/pyproject.toml ./services/database_migrations/pyproject.toml
COPY python_services/database_migrations/poetry.lock ./services/database_migrations/poetry.lock

WORKDIR /app/services/database_migrations

RUN poetry config virtualenvs.create false \
    && poetry lock \
    && poetry install --only=main --no-root

RUN adduser --disabled-password --gecos '' appuser
RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 50051

COPY python_services/database_migrations/src/ src

CMD ["python", "-m", "database_migrations.__main__"]