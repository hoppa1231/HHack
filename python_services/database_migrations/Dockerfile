# Production Dockerfile for database_migrations service
FROM python:3.13-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
  PYTHONUNBUFFERED=1 \
  POETRY_NO_INTERACTION=1 \
  POETRY_VENV_IN_PROJECT=1 \
  POETRY_CACHE_DIR=/tmp/poetry_cache \
  PYTHONPATH='/app/services/database_migrations/src'

# Install system dependencies
RUN apt-get update && apt-get install -y \
  git \
  curl \
  build-essential \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install poetry==2.1.0

# Set working directory
WORKDIR /app

# Copy Poetry configuration files
COPY python_services/database_migrations/pyproject.toml ./services/database_migrations/pyproject.toml
WORKDIR /app/services/database_migrations

# Configure poetry and install dependencies
RUN poetry config virtualenvs.create false \
  && poetry lock \
  && poetry install --only=main --no-root


# Create non-root user for security
RUN adduser --disabled-password --gecos '' appuser
RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 50051

COPY python_services/database_migrations/src/ src

# Run the application
CMD ["python", "-m", "database_migrations.__main__"]
