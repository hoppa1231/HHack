from flask import Blueprint, request, jsonify
from pydantic import ValidationError
from app.schemas import *
from app import news_service, user_service

main_bp = Blueprint('main', __name__, url_prefix='/api')

@main_bp.get('/health')
def health():
    return {"status": "ok"}

@main_bp.errorhandler(ValidationError)
def handle_validation_error(e: ValidationError):
    # Единый 422 вместо 500
    return jsonify({"detail": e.errors()}), 422

def require_json():
    if not request.is_json:
        return jsonify({"detail": "Content-Type must be application/json"}), 415

@main_bp.post('/news')
def news():
    if (resp := require_json()): return resp
    payload = request.get_json(silent=True) or {}
    data = NewsRequest.model_validate(payload)
    response_data = news_service.get_news(data)
    return response_data.model_dump()

@main_bp.post('/summary')
def summary():
    if (resp := require_json()): return resp
    payload = request.get_json(silent=True) or {}
    data = SummaryRequest.model_validate(payload)
    response_data = news_service.get_summary(data)
    return response_data.model_dump()

@main_bp.post('/register')
def register():
    if (resp := require_json()): return resp
    payload = request.get_json(silent=True) or {}
    data = Register.model_validate(payload)
    response_data = user_service.register(data)
    return TokenResponse.model_validate(response_data).model_dump()

@main_bp.post('/login')
def login():
    if (resp := require_json()): return resp
    payload = request.get_json(silent=True) or {}
    data = Login.model_validate(payload)  # name обязателен -> при отсутствии вернём 422 через handler
    response_data = user_service.login(data)
    return TokenResponse.model_validate(response_data).model_dump()
