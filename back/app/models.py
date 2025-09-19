from app import db
from enum import Enum

class Preference(Enum):
    SPORT = 'sport',
    MUSIC = 'music',
    MOVIE = 'movie',
    POLITICS = 'politics'
    SCIENCE = 'science'

class User(db.Model):
    name = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    preferences = db.Column(db.String(100), default='')




