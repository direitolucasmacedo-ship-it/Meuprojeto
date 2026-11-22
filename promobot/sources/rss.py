import logging
import re
from typing import List, Optional

import feedparser

from ..models import Offer
from .base import Source

log = logging.getLogger(__name__)

PRICE_RE = re.compile(r"R\$\s*([\d.]+(?:,\d{2})?)")


def parse_brl(text: str) -> List[float]:
    values = []
    for raw in PRICE_RE.findall(text or ""):
        try:
            values.append(float(raw.replace(".", "").replace(",", ".")))
        except ValueError:
            pass
    return values


def _image(entry) -> Optional[str]:
    for key in ("media_content", "media_thumbnail"):
        items = entry.get(key) or []
        if items and items[0].get("url"):
            return items[0]["url"]
    for enc in entry.get("enclosures", []) or []:
        if str(enc.get("type", "")).startswith("image"):
            return enc.get("href")
    return None


class RSSSource(Source):
    def __init__(self, feed_url: str):
        self.feed_url = feed_url
        self.name = f"rss:{feed_url}"

    def fetch(self) -> List[Offer]:
        feed = feedparser.parse(self.feed_url)
        if feed.bozo and not feed.entries:
            log.warning("Falha ao ler feed %s: %s", self.feed_url, feed.bozo_exception)
            return []
        offers = []
        for e in feed.entries:
            title, link = e.get("title", "").strip(), e.get("link", "").strip()
            if not title or not link:
                continue
            prices = parse_brl(f"{title} {e.get('summary', '')}")
            price = min(prices) if prices else None
            old_price = max(prices) if len(prices) > 1 and max(prices) > price else None
            offers.append(Offer(title=title, url=link, source=self.name, price=price,
                                old_price=old_price, image_url=_image(e)))
        return offers
