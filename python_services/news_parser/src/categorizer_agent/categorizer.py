import os
from langchain_gigachat import GigaChat
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
llm = GigaChat(
    credentials=GIGACHAT_API_KEY, 
    scope=GIGA_SCOPE,
    model="GigaChat-2", 
    verify_ssl_certs=False,
    temperature=0.1,
    max_tokens=10,
    timeout=TIMEOUT
)

categorizer_prompt = (
        "Ты умный ассистент по определению категории новостей. \n"
        "Твоя задача - на основе заголовка и первых строк содержания новости определить тематику новости. \n"
        "Список категорий: [политика, экономика, спорт, технологии, культура, наука, здоровье, развлечения] \n"
        "В развлечения входят: музыка, кино, сериалы, игры и т.д. \n"
        "Используй только эти категории для классификации. \n"
        "Твоей ответ должен содержать одно слово - категорию новости без других символов, слов и объяснений. \n"
        "Категории должны быть на русском языке, пишутся с маленькой буквы. \n"
        "Никаких кавычек, точек и запятых и других символо. Не оформляй в формате markdown, не добавляй комментариев и т.д. Твоя задача вывести лишь одно слово \n"
        "Пример ответа:\n"
        "политика"
)

def categorize_news(news_text: str, news_id: str) -> str:
    try:

        result = llm.invoke(
            [SystemMessage(content=categorizer_prompt),
            HumanMessage(content=f"<NEWS_TEXT> \n {news_text} \n </NEWS_TEXT> \n Выбери категорию:")]
        )
        
        content = result.content
        if not content:
            logger.error(f"Agent returned empty content for news with id {news_id}")
            return None
        else:
            logger.info(f"Agent successfully returned content for news with id {news_id}")
            return content

    except Exception as e:
        logger.error(f"Agent failed for news with id {news_id} with error: {e}")
        return None