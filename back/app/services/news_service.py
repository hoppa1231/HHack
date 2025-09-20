from app.schemas import *

class NewsService:
    def get_news(self, data : NewsRequest) -> NewsResponse:
        items = [
            News(
                news_id=1,
                img_url="https://avatars.mds.yandex.net/i?id=f6de7130bb6d7182e085a6e98e6eb3174d9a6c9b-5192502-images-thumbs&n=13",
                header="News Title",
                mini_description="News Description",
            ),
        ]
        return NewsResponse(news=items)
    
    def get_summary(self, data : SummaryRequest) -> SummaryResponse:
        response  = SummaryResponse(
            header="news header",
            summary="news summary"
        )
        return response