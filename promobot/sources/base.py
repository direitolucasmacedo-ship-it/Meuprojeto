from abc import ABC, abstractmethod
from typing import List

from ..models import Offer


class Source(ABC):
    """Uma fonte de promoções (feed RSS, API de afiliados da loja, etc.)."""

    name = "source"

    @abstractmethod
    def fetch(self) -> List[Offer]:
        ...
