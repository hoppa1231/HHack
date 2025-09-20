from pydantic import BaseModel, Field
from typing import List
from enum import Enum

class Register(BaseModel):
    name: str = Field(description="имя пользователя")
    password: str = Field(description="пароль пользователя")
    preferences: List[str] = Field(description="Список тегов предпочтений")

class Login(BaseModel):
    name: str = Field(description="имя пользователя")

class TokenPayload(BaseModel):
    user_id: int = Field(description="id пользователя")

class TokenResponse(BaseModel):
    access_token: str = Field(description="JWT-токен для авторизации")

class NewsPeriod(Enum):
    DAY = "day"
    WEEK = "week"
    MONTH = "month"

class NewsRequest(BaseModel):
    user_id: int = Field(description='id пользователя')
    news_period: NewsPeriod = Field(description="Период за который нужно получить сводку новостей")

class News(BaseModel):
    news_id: int = Field(description="id новости")
    img_url: str = Field(description="Ссылка на картинку новости")
    header: str = Field(description="Заголовок новости")
    mini_description: str = Field(description="Краткое описание новости")

class NewsResponse(BaseModel):
    news: List[News] = Field(description="Список новостей")

class SummaryRequest(BaseModel):
    news_id: int = Field(description="id новости")

class SummaryResponse(BaseModel):
    header: str = Field(description="Заголовок новости")
    summary: str = Field(description="Сводка новости")