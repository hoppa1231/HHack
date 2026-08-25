#!/bin/sh
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
    --set=news_db="$POSTGRES_NEWS_DB" <<-'EOSQL'
    SELECT format('CREATE DATABASE %I', :'news_db')
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = :'news_db')\gexec
EOSQL
