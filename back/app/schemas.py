from datetime import datetime, timedelta, timezone
from enum import Enum
from typing import List, Optional, Literal

from pydantic import BaseModel, Field

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
    category: Optional[str] = Field(default=None, description="Категория новости")
    period: Optional[NewsPeriod] = Field(default=None, description="Период выборки")
    limit: int = Field(default=50, ge=1, le=200, description="Максимальное количество новостей")

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
    link: Optional[str] = None


class NewsListResponse(BaseModel):
    items: List[NewsItem]


class NewsDetail(NewsItem):
    content: Optional[str] = None


