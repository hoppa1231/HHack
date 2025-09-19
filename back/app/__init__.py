from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from app.services import UserService, NewsService
from app.config import Config

db = SQLAlchemy()
migrate = Migrate()

# Создаем сервисы
news_service = NewsService()
user_service = UserService()

def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)

    # Инициализация расширений
    db.init_app(app)
    migrate.init_app(app, db)

    # Регистрация маршрутов
    from app.routes import main_bp
    app.register_blueprint(main_bp)
    
    # Создание таблиц БД
    with app.app_context():
        db.create_all()
    
    return app