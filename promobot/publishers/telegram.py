import re

import requests

from ..models import Offer
from .base import Publisher

CAPTION_LIMIT = 1024


TOKEN_RE = re.compile(r"\d{5,}:[A-Za-z0-9_-]{30,}")


def clean_token(raw: str) -> str:
    """Aceita o token mesmo colado com espaços, aspas, 'bot' na frente ou '/getMe' no fim."""
    match = TOKEN_RE.search(raw or "")
    return match.group(0) if match else (raw or "").strip()


class TelegramPublisher(Publisher):
    def __init__(self, token: str, chat_id: str, timeout: int = 20):
        if not token or not chat_id:
            raise ValueError("Defina TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID no .env")
        self.api = f"https://api.telegram.org/bot{clean_token(token)}"
        self.chat_id = chat_id
        self.timeout = timeout

    def _call(self, method: str, payload: dict) -> dict:
        resp = requests.post(f"{self.api}/{method}", json=payload, timeout=self.timeout)
        data = resp.json()
        if not data.get("ok"):
            desc = data.get("description", "")
            hint = ""
            if data.get("error_code") in (401, 404):
                hint = " -> o TOKEN no .env está errado (confira no @BotFather)"
            elif "chat not found" in desc:
                hint = " -> o TELEGRAM_CHAT_ID no .env está errado (use @nome_do_canal)"
            elif "rights" in desc or "administrator" in desc:
                hint = " -> o robô não é administrador do canal"
            raise RuntimeError(f"Telegram {method} falhou: {desc}{hint}")
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
