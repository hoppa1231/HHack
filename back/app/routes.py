from flask import Blueprint, jsonify, request
from pydantic import ValidationError

from app import news_service, user_service
from app.schemas import Login, NewsQueryParams, Register, TokenResponse

main_bp = Blueprint("main", __name__, url_prefix="/api")


@main_bp.get("/health")
def health():
    return {"status": "ok"}


@main_bp.errorhandler(ValidationError)
def handle_validation_error(error: ValidationError):
    return jsonify({"detail": error.errors()}), 422


@main_bp.errorhandler(ValueError)
def handle_value_error(error: ValueError):
    return jsonify({"detail": str(error)}), 400


@main_bp.get("/news")
def list_news():
    data = request.args.to_dict(flat=True)
    params = NewsQueryParams.model_validate(data)
    items = news_service.get_news(params)
    return jsonify([item.model_dump(mode="json") for item in items])


@main_bp.get("/news/<int:news_id>")
def news_detail(news_id: int):
    try:
        item = news_service.get_detail(news_id)
    except LookupError:
        return jsonify({"detail": "News item not found"}), 404
    return jsonify(item.model_dump(mode="json"))


@main_bp.get("/sources")
def list_sources():
    sources = news_service.get_sources()
    return jsonify(sources)


@main_bp.post("/register")
def register():
    payload = request.get_json(silent=True) or {}
    data = Register.model_validate(payload)
    response_data = user_service.register(data)
    return TokenResponse.model_validate(response_data).model_dump()


@main_bp.post("/login")
def login():
    payload = request.get_json(silent=True) or {}
    data = Login.model_validate(payload)
    response_data = user_service.login(data)
    return TokenResponse.model_validate(response_data).model_dump()


