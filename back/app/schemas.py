from datetime import datetime, timedelta, timezone
from enum import Enum
from typing import List, Optional, Literal

from pydantic import BaseModel, Field, model_validator

CategoryType = Literal[
    'политика', 'экономика', 'спорт', 'технологии', 
    'культура', 'наука', 'здоровье', 'развлечения', 'другое'
]

class Register(BaseModel):
    name: str = Field(description="Имя пользователя")
    password: str = Field(description="Пароль пользователя")
    preferences: List[CategoryType] = Field(
        default_factory=list,
        description="Список интересующих категорий"
    )

class Login(BaseModel):
    name: str = Field(description="Имя пользователя")
    password: str = Field(description="Пароль пользователя")


class TokenResponse(BaseModel):
    access_token: str = Field(description="JWT-токен для доступа")


class NewsPeriod(str, Enum):
    day = "day"
    week = "week"
    month = "month"


class NewsQueryParams(BaseModel):
    category: Optional[str] = Field(default=None, description="��⥣��� ������")
    period: Optional[NewsPeriod] = Field(default=None, description="��ਮ� �롮ਨ")
    sources: Optional[List[str]] = Field(
        default=None,
        description="Sources to include in the response",
    )
    limit: int = Field(default=50, ge=1, le=200, description="Максимальное количество новостей")

    @model_validator(mode="before")
    @classmethod
    def normalize_sources(cls, values: dict) -> dict:
        sources = values.get("sources")
        if isinstance(sources, str):
            parsed = [item.strip() for item in sources.split(",") if item.strip()]
            values["sources"] = parsed or None
        elif isinstance(sources, list):
            parsed = [str(item).strip() for item in sources if str(item).strip()]
            values["sources"] = parsed or None
        return values

    def cutoff(self) -> Optional[datetime]:
        if not self.period:
            return None
        now = datetime.now(timezone.utc)
        mapping = {
            NewsPeriod.day: timedelta(days=1),
            NewsPeriod.week: timedelta(days=7),
            NewsPeriod.month: timedelta(days=30),
        }
        return now - mapping[self.period]


class NewsItem(BaseModel):
    id: int
    title: str
    summary: str
    category: str
    source: str
    published_at: Optional[datetime] = None
    image: Optional[str] = None
    description: Optional[str] = None
    link: Optional[str] = None


class NewsListResponse(BaseModel):
    items: List[NewsItem]


class NewsDetail(NewsItem):
    content: Optional[str] = None





