import os
from playwright.sync_api import sync_playwright
from markdownify import markdownify
from yandex_search_api import YandexSearchAPIClient
from yandex_search_api.client import SearchType
FOLDER_ID = os.environ.get("YANDEX_FOLDER_ID")
OAUTH_KEY = os.environ.get("YANDEX_OAUTH_KEY")


def fetch_page_content(url: str) -> str:
    """Загружает страницу через Playwright и конвертирует HTML → Markdown."""
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            page.goto(url, timeout=30000)
            html = page.content()
            browser.close()
            return markdownify(html)
    except Exception as e:
        print(f"[!] Ошибка при загрузке {url}: {e}")
        return ""


def yandex_search(query: str, max_results: int = 5, fetch_full_page: bool = False):
    """
    Выполняет поиск через Yandex Search API и при необходимости парсит страницы.
    """
    try:
        # 🔹 1. Создаём клиента Яндекса
        client = YandexSearchAPIClient(
            folder_id=FOLDER_ID,
            oauth_token=OAUTH_KEY
            )

        # 🔹 2. Получаем ссылки
        links = client.get_links(
            query_text=query,
            search_type=SearchType.RUSSIAN,
            n_links=max_results
        )

        results = []
        for link in links:
            result_item = {
                "title": "",
                "url": link,
                "content": "",
                "raw_content": "",
            }

            # 🔹 3. Если включено — загружаем контент страницы
            if fetch_full_page:
                markdown = fetch_page_content(link)
                result_item["raw_content"] = markdown

            results.append(result_item)

        return results

    except Exception as e:
        print(f"Yandex search failed for query '{query}': {e}")
        return []