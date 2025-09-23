from app import db
from enum import Enum

class Preference(Enum):
    SPORT = 'sport',
    MUSIC = 'music',
    MOVIE = 'movie',
    POLITICS = 'politics'
    SCIENCE = 'science'

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    preferences = db.Column(db.String(100), default='') # Пока не знаю как это хранить, поэтому пока пусть будет строкой


class News(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    header = db.Column(db.String(100))
    tags = db.Column(db.String(100)) # пока назовем теги, но в общем понимании, это - принадлежность новости к теме
    image_url = db.Column(db.String(100), default='')

    sources = db.relationship('NewsSource', backref='news', lazy=True, cascade='all, delete-orphan')
    

class NewsSources(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    news_id = db.Column(db.Integer, db.ForeignKey('news.id'), nullable=False)
    source_name = db.Column(db.String(50), nullable=False)
    url = db.Column(db.String(200), nullable=False)

    # Метаданные об источнике
    reading_time = db.Column(db.Integer, default=0) # Чтение в минутах
    views_count = db.Column(db.Integer, default=0)
    
