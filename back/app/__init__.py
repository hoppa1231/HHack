from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()

def create_app(config_class) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_class)

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