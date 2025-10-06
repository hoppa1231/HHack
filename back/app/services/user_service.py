from typing import Dict

from werkzeug.security import check_password_hash, generate_password_hash

from app import db
from app.models import User
from app.schemas import Login, Register, TokenResponse


class UserService:
    def register(self, data: Register) -> Dict[str, str]:
        if User.query.filter_by(name=data.name).first():
            raise ValueError("Пользователь с таким именем уже существует")

        user = User(
            name=data.name,
            password=generate_password_hash(data.password),
            preferences=data.preferences,
        )
        db.session.add(user)
        db.session.commit()
        return TokenResponse(access_token=self._make_token(user.id)).model_dump()

    def login(self, data: Login) -> Dict[str, str]:
        user = User.query.filter_by(name=data.name).first()
        if not user or not check_password_hash(user.password, data.password):
            raise ValueError("Неверное имя пользователя или пароль")

        return TokenResponse(access_token=self._make_token(user.id)).model_dump()

    def _make_token(self, user_id: int) -> str:
        return f"token-{user_id}"


