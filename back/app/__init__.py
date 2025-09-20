from typing import Optional, Type

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

from app.config import Config

db = SQLAlchemy()
migrate = Migrate()

news_service = None
user_service = None


def create_app(config_class: Optional[Type[Config]] = None) -> Flask:
    """Application factory used by both tests and production."""

    app = Flask(__name__)
    app.config.from_object(config_class or Config)

    db.init_app(app)
    migrate.init_app(app, db)

    from app.services import NewsService, UserService

    global news_service, user_service
    news_service = NewsService()
    user_service = UserService()

    from app.routes import main_bp

    app.register_blueprint(main_bp)

    with app.app_context():
        db.create_all()

    return app
