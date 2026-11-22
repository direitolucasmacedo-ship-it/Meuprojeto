from ..models import Offer
from .base import Publisher


class ConsolePublisher(Publisher):
    """Modo simulação: mostra a mensagem no terminal em vez de publicar."""

    def publish(self, offer: Offer, text: str) -> None:
        print("=" * 60)
        if offer.image_url:
            print(f"[imagem] {offer.image_url}")
        print(text)
