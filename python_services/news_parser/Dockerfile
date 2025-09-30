# Production Dockerfile for news_parser service
FROM python:3.13-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
  PYTHONUNBUFFERED=1 \
  POETRY_NO_INTERACTION=1 \
  POETRY_VENV_IN_PROJECT=1 \
  POETRY_CACHE_DIR=/tmp/poetry_cache \
  PYTHONPATH='/app/services/news_parser/src'

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
COPY python_services/news_parser/pyproject.toml ./services/news_parser/pyproject.toml
COPY python_services/news_parser/poetry.lock ./services/news_parser/poetry.lock

WORKDIR /app/services/news_parser

# Configure poetry and install dependencies
RUN poetry config virtualenvs.create false \
  && poetry lock \
  && poetry install --only=main --no-root


# Create non-root user for security
RUN adduser --disabled-password --gecos '' appuser
RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 50050

COPY python_services/news_parser/src/ src

# Run the application
CMD ["python", "-m", "news_parser.__main__"]
