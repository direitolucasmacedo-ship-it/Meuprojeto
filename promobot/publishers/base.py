from abc import ABC, abstractmethod

from ..models import Offer


class Publisher(ABC):
    @abstractmethod
    def publish(self, offer: Offer, text: str) -> None:
        ...
