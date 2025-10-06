from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, Enum
from sqlalchemy.ext.declarative import declarative_base
import enum

Base = declarative_base()

class NewsCategory(enum.Enum):
    политика = "политика"
    экономика = "экономика"
    спорт = "спорт"
    технологии = "технологии"
    IT = "IT"
    культура = "культура"
    наука = "наука"
    здоровье = "здоровье"
    развлечения = "развлечения"
    другое = "другое"

class News(Base):
    __tablename__ = "news"

    id = Column(Integer, primary_key=True)
    title = Column(Text, nullable=False)
    link = Column(Text, unique=True, nullable=False)
    source = Column(String(100), nullable=False)
    published = Column(TIMESTAMP(timezone=True))
    content = Column(Text)
    category = Column(Enum(NewsCategory, name="news_category"), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True))
    # news_score = Column(Integer)
