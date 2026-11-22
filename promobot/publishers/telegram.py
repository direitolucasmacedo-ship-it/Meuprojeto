import requests

from ..models import Offer
from .base import Publisher

CAPTION_LIMIT = 1024


class TelegramPublisher(Publisher):
    def __init__(self, token: str, chat_id: str, timeout: int = 20):
        if not token or not chat_id:
            raise ValueError("Defina TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID no .env")
        self.api = f"https://api.telegram.org/bot{token}"
        self.chat_id = chat_id
        self.timeout = timeout

    def _call(self, method: str, payload: dict) -> dict:
        resp = requests.post(f"{self.api}/{method}", json=payload, timeout=self.timeout)
        data = resp.json()
        if not data.get("ok"):
            raise RuntimeError(f"Telegram {method} falhou: {data.get('description')}")
        return data

    def publish(self, offer: Offer, text: str) -> None:
        base = {"chat_id": self.chat_id, "parse_mode": "HTML"}
        if offer.image_url and len(text) <= CAPTION_LIMIT:
            try:
                self._call("sendPhoto", {**base, "photo": offer.image_url, "caption": text})
                return
            except RuntimeError:
                pass  # imagem inválida: cai para mensagem só de texto
        self._call("sendMessage", {**base, "text": text, "disable_web_page_preview": False})
