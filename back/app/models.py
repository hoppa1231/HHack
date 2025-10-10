from sqlalchemy.dialects.postgresql import ENUM as PGEnum
from sqlalchemy.sql import func

from app import db

NEWS_CATEGORIES = (
    "политика",
    "экономика",
    "спорт",
    "технологии",
    "IT",
    "культура",
    "наука",
    "здоровье",
    "развлечения",
    "другое",
)

news_category_enum = PGEnum(*NEWS_CATEGORIES, name="news_category", create_type=False)


class News(db.Model):
    __tablename__ = "news"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text, nullable=False)
    link = db.Column(db.Text, unique=True, nullable=False)
    source = db.Column(db.String(100), nullable=False)
    published = db.Column(db.DateTime(timezone=True), server_default=func.now())
    content = db.Column(db.Text)
    image_url = db.Column(db.Text)
    description = db.Column(db.Text)
    news_resume = db.Column(db.Text)
    category = db.Column(news_category_enum, nullable=False)
    # news_score = db.Column(db.Float, nullable=True, default=0.0)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        db.Index("ix_news_published", published.desc()),
        db.Index("ix_news_category", category),
    #    db.Index("ix_news_score", news_score.desc()),
    )

    def summary(self, length: int = 320) -> str:
        if not self.content:
            return ""
        text = self.content.strip()
        if len(text) <= length:
            return text
        truncated = text[:length].rsplit(" ", 1)[0]
        return truncated + "..."


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    preferences = db.Column(db.JSON, nullable=False, default=list)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
