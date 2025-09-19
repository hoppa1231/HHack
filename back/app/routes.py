from flask import Blueprint, request
from app.schemas import *
from app import news_service, user_service

main_bp = Blueprint('main', __name__, url_prefix='/api')

@main_bp.post('/news')
def news():
    data = NewsRequest.model_validate(request.get_json())
    response_data = news_service.get_news(data)
    return NewsResponse.model_validate(response_data).model_dump()

@main_bp.post('/summary')
def summary():
    data = SummaryRequest.model_validate(request.get_json())
    response_data = news_service.get_summary(data)
    return SummaryResponse.model_validate(response_data).model_dump()

@main_bp.post('/register')
def register():
    data = Register.model_validate(request.get_json())
    response_data = user_service.register(data)
    return TokenResponse.model_validate(response_data).model_dump()

@main_bp.post('/login')
def login():
    data = Login.model_validate(request.get_json())
    response_data = user_service.login(data)
    return TokenResponse.model_validate(response_data).model_dump()