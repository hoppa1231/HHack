from app.schemas import *
from app import db
from app.models import User

class UserService:
    def register(self, data : Register) -> TokenResponse:
        response = TokenResponse(
            access_token = 'token example'
        )
        return response

    def login(self, data : Login) -> TokenResponse:
        response = TokenResponse(
            access_token = 'token example'
        )
        return response