RSS_FEEDS = {
    "ТАСС": "https://tass.ru/rss/v2.xml",
    "РИА": "https://ria.ru/export/rss2/archive/index.xml",
    "РБК": "https://rssexport.rbc.ru/rbcnews/news/30/full.rss",
    "Lenta": "https://lenta.ru/rss",
    "Meduza": "https://meduza.io/rss/all",
    "Habr": "https://habr.com/ru/rss/all/all/?fl=ru"
}

class RSSFeed:
    def __init__(self, name: str, url: str, chosen: bool = False):
        self.name = name
        self.url = url
        self.chosen = chosen
        self.validate()

    def validate(self):
        if not self.name or not isinstance(self.name, str):
            raise ValueError("Feed name must be a non-empty string")
        if not self.url or not isinstance(self.url, str) or not self.url.startswith("http"):
            raise ValueError("Feed URL must be a valid URL string")
        

class NewsSource:
    def __init__(self, feeds=None):
        self.feeds = feeds or [RSSFeed(name, url, True) for name, url in RSS_FEEDS.items()]

    def get_feed_urls(self):
        return {feed.name: feed.url for feed in self.feeds if feed.chosen}
    
    def get_feed_chosen(self):
        return {feed.name: feed.chosen for feed in self.feeds}
    
    def set_feed_chosen(self, name: str, chosen: bool):
        for feed in self.feeds:
            if feed.name == name:
                feed.chosen = chosen
                return
        raise ValueError(f"Feed with name '{name}' not found")
    
    def add_feed(self, name: str, url: str):
        new_feed = RSSFeed(name, url)
        RSS_FEEDS[name] = url
        self.feeds.append(new_feed)

    def remove_feed(self, name: str):
        self.feeds = [feed for feed in self.feeds if feed.name != name]

    
