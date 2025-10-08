-- States
create type news_category as enum (
    'политика',
    'экономика',
    'спорт',
    'технологии',
    'IT',
    'культура',
    'наука',
    'здоровье',
    'развлечения',
    'другое'
);


CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    link TEXT UNIQUE NOT NULL,
    source VARCHAR(100) NOT NULL,
    published TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    content TEXT,
    image_url TEXT,
    description TEXT,
    category news_category NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    news_resume TEXT,
    news_score INTEGER
);
