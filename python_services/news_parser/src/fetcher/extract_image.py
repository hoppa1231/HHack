from urllib.parse import urljoin
from bs4 import BeautifulSoup

def extract_image_url_from_enclosures(entry):
    """Пытается вытащить URL изображения из всех типичных мест RSS/Atom.
    Учитывает <description> с <img> (как у Хабра)."""
    base = getattr(entry, "link", None)

    # 1) media:content / media:thumbnail
    for m in getattr(entry, "media_content", []) or []:
        t = (m.get("type") or m.get("medium") or "").lower()
        if "image" in t:
            if m.get("url"):
                return m["url"]
    thumbs = getattr(entry, "media_thumbnail", None)
    if thumbs:
        url = thumbs[0].get("url")
        if url:
            return url

    # 2) enclosures (<enclosure type="image/...">)
    for enc in getattr(entry, "enclosures", []) or []:
        t = (enc.get("type") or "").lower()
        if t.startswith("image/") or "image" in t:
            return enc.get("href") or enc.get("url")

    # 3) links rel=enclosure
    for link in getattr(entry, "links", []) or []:
        if link.get("rel") == "enclosure" and "image" in (link.get("type") or "").lower():
            return link.get("href")

    # 4) HTML-фрагменты: content / summary / description — Хабр кладёт <img> в <description>
    html_candidates: list[str] = []
    # content:encoded → entry.content[i].value
    if getattr(entry, "content", None):
        html_candidates += [c.value for c in entry.content if getattr(c, "value", None)]
    # summary_detail.value может содержать «сырое» HTML
    if getattr(entry, "summary_detail", None) and getattr(entry.summary_detail, "value", None):
        html_candidates.append(entry.summary_detail.value)
    # summary/description
    html_candidates += [
        getattr(entry, "summary", ""),
        getattr(entry, "description", ""),
    ]

    for html in html_candidates:
        url = _first_image_from_html(html, base_href=base)
        if url:
            return url

    # 5) iTunes image (на всякий случай)
    itimg = getattr(entry, "itunes_image", None)
    if itimg:
        if isinstance(itimg, dict):
            return itimg.get("href") or itimg.get("url")
        return itimg

    return None


def _first_image_from_html(html: str, base_href: str | None = None) -> str | None:
    """Достаёт первую осмысленную картинку из HTML-фрагмента (<img>, <picture>/<source>, data-src, srcset)."""
    if not html:
        return None
    soup = BeautifulSoup(html, "html.parser")

    # 1) <picture> с <source srcset=...> — берём самый широкий из srcset
    for pic in soup.find_all("picture"):
        # затем сам <img> внутри picture
        img = pic.find("img")
        if img:
            return urljoin(base_href or "", img.get("src") or "")

    # 2) Обычные <img> (в т.ч. Habr: <img src="https://habrastorage.org/...">)
    for img in soup.find_all("img"):
        return urljoin(base_href or "", img.get("src") or "")

    return None