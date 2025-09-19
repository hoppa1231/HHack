from app.schemas import *

class NewsService:
    def get_news(self, data : NewsRequest) -> NewsResponse:
        response = NewsResponse(
            [
                News(
                    news_id=1,
                    img_url = "https://avatars.mds.yandex.net/i?id=f6de7130bb6d7182e085a6e98e6eb3174d9a6c9b-5192502-images-thumbs&n=13",
                    header = "News Title",
                    mini_description = "News Description"
                ),
            ]
        )
        return response
    
    def get_summary(self, data : SummaryRequest) -> SummaryResponse:
        response  = SummaryResponse(
            header="news header",
            summary="news summary"
        )
        return response
    
class UserService:
    def register(self, data : Register) -> TokenResponse:
        response = TokenResponse(
            access_token='token example'
        )
        return response

    def login(self, data : Login) -> TokenResponse:
        response = TokenResponse(
            access_token = 'token example'
        )
        return response