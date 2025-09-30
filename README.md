# HHack News Aggregator

## Описание

Проект предназначен для сбора, хранения и обработки новостей с популярных русскоязычных источников и их аггрегации. Включает автоматическую категоризацию новостей с помощью LLM (GigaChat) и хранение в базе данных PostgreSQL.

## Структура проекта

```
HHack/
├── docker-compose.yaml
├── .env.template
├── .env
├── init_db/
│   └── init_news_db.sh
├── python_services/
│   ├── database_migrations/
│   │   ├── Dockerfile
│   │   ├── pyproject.toml
│   │   ├── poetry.lock
│   │   └── src/
│   │       ├── database_migrations/
│   │       │   └── main.py
│   │       └── db/
│   │           ├── migrations.py
│   │           └── create_initial_structure.sql
│   └── news_parser/
│       ├── Dockerfile
│       ├── pyproject.toml
│       ├── poetry.lock
│       └── src/
│           ├── news_parser/
│           │   └── __main__.py
│           ├── lib/
│           │   ├── db.py
│           │   ├── models.py
│           │   └── sources.py
│           ├── fetcher/
│           │   └── fetcher.py
│           └── categorizer_agent/
│               └── categorizer.py
└
```

## Быстрый старт

### 1. Клонирование репозитория

```sh
git clone <repo_url>
cd mia
```

### 2. Настройка переменных окружения

- Скопируйте `.env.template` в `.env` и заполните значения.
- Важно: для работы сервисов необходимы ключи GigaChat и корректные строки подключения к PostgreSQL.

```sh
cp .env.template .env
```

### 3. Запуск через Docker Compose

```sh
docker-compose up -d
```

- Сервис `postgres` поднимает базу данных.
- Сервис `database_migrations` применяет миграции (создаёт структуру таблиц).
- Сервис `news_parser` парсит новости, категоризирует и сохраняет их в базу.

### 4. Проверка состояния

- Для проверки статуса контейнеров:

```sh
docker-compose ps
```

- Для просмотра логов:

```sh
docker-compose logs -f
```

## Описание сервисов

### PostgreSQL

- Используется образ `ankane/pgvector:latest`.
- Инициализация базы происходит через скрипт `init_db/init_news_db.sh`.

### database_migrations

- Применяет миграции к базе данных.
- Использует библиотеку `yoyo-migrations`.
- Миграции лежат в `python_services/database_migrations/src/db/`.

### news_parser

- Парсит новости из RSS-источников.
- Категоризирует новости с помощью GigaChat.
- Сохраняет новости в базу данных.

## Основные переменные окружения

- `POSTGRES_NEWS_URL` — строка подключения к базе новостей.
- `GIGA_AUTH_KEY` — ключ авторизации GigaChat.
- `GIGA_SCOPE` — scope для GigaChat API.

## Добавление новых источников

Добавьте RSS-адрес в файл  
`python_services/news_parser/src/lib/sources.py`  
в словарь `RSS_FEEDS`.

## Применение миграций вручную

```sh
docker-compose run --rm database_migrations
```

## Запуск парсинга вручную

```sh
docker-compose run --rm news_parser
```

## Полезные команды

- Остановить все сервисы:

```sh
docker-compose down -v
```

- Перезапустить контейнеры:

```sh
docker-compose up -d --force-recreate --build
```

- Пересобрать контейнеры:

```sh
docker-compose build --no-cache
```
