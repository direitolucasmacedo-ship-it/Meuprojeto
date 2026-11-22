"""Guarda o que já foi publicado para não repetir ofertas."""
import hashlib
import sqlite3
from urllib.parse import urlparse


def offer_key(url: str) -> str:
    p = urlparse(url)
    base = f"{(p.hostname or '').lower()}{p.path.rstrip('/')}"
    return hashlib.sha256(base.encode()).hexdigest()


class Storage:
    def __init__(self, path: str = "promobot.db"):
        self.conn = sqlite3.connect(path)
        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS posted ("
            " key TEXT PRIMARY KEY, title TEXT, url TEXT,"
            " posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
        )
        self.conn.commit()

    def already_posted(self, url: str) -> bool:
        cur = self.conn.execute("SELECT 1 FROM posted WHERE key = ?", (offer_key(url),))
        return cur.fetchone() is not None

    def mark_posted(self, url: str, title: str) -> None:
        self.conn.execute(
            "INSERT OR IGNORE INTO posted (key, title, url) VALUES (?, ?, ?)",
            (offer_key(url), title, url),
        )
        self.conn.commit()
