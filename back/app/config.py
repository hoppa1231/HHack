import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = 'my-secret-key-here'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'
