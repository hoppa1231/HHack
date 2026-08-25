import logging
import os
from typing import Final

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_gigachat import GigaChat

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
)

GIGACHAT_API_KEY = os.environ.get("GIGA_AUTH_KEY")
GIGA_SCOPE = os.environ.get("GIGA_SCOPE")
TIMEOUT: Final = 180_000
FALLBACK_CATEGORY: Final = "другое"
ALLOWED_CATEGORIES: Final = {
    "политика",
    "экономика",
    "спорт",
    "технологии",
    "культура",
    "наука",
    "здоровье",
    "развлечения",
}

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
    """Return a category from the platform taxonomy, or a safe fallback."""
    try:
        result = llm.invoke(
            [SystemMessage(content=categorizer_prompt),
            HumanMessage(content=f"<NEWS_TEXT> \n {news_text} \n </NEWS_TEXT> \n Выбери категорию:")]
        )
        
        content = str(result.content).strip().lower() if result.content else ""
        if not content:
            logger.warning("Categorizer returned empty content for article %s", news_id)
            return FALLBACK_CATEGORY

        if content not in ALLOWED_CATEGORIES:
            logger.warning(
                "Categorizer returned unsupported category %r for article %s",
                content,
                news_id,
            )
            return FALLBACK_CATEGORY

        logger.info("Categorized article %s as %s", news_id, content)
        return content

    except Exception:
        logger.exception("Categorization failed for article %s", news_id)
        return FALLBACK_CATEGORY
