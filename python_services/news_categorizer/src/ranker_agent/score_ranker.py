import os
from langchain_deepseek import ChatDeepSeek
from langchain_core.messages import SystemMessage, HumanMessage
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
)

GIGACHAT_API_KEY = os.environ.get("GIGA_AUTH_KEY")
GIGA_SCOPE = os.environ.get("GIGA_SCOPE")
TIMEOUT = 180000

# Инициализация LLM
llm = ChatDeepSeek(
            model="deepseek-chat", 
            temperature=1,
            max_tokens=10,
        )

ranker_prompt = (
        "Ты умный ассистент по определению интереса новостей. \n"
        "Твоя задача - на основе заголовка и первых строк содержания новости определить, насколько сильно данная новость заинтересует людей. \n"
        "Целевые метрики - предполагаемое количество кликов на эту новость и полное прочтение. \n"
        "Твоей ответ должен содержать одно число от 1 до 100, где 100 - критически важная новость, а 1 - совсем неинтересная. \n"
        "Никаких кавычек, точек и запятых. Одно число \n"
        "Пример ответа:\n"
        "87"
)

def score_news(news_text: str, news_id: str) -> str:
    try:

        result = llm.invoke(
            [SystemMessage(content=ranker_prompt),
            HumanMessage(content=f"<NEWS_TEXT> \n {news_text} \n </NEWS_TEXT> \n Оцени новость по шкале от 1 до 100:" )]
        )
        
        content = result.content
        if not content:
            logger.error(f"Score agent returned empty content for news with id {news_id}")
            return None
        else:
            logger.info(f"Score agent successfully returned content for news with id {news_id}")
            return int(content)

    except Exception as e:
        logger.error(f"Score agent failed for news with id {news_id} with error: {e}")
        return None