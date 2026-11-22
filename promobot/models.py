from dataclasses import dataclass, field
from typing import Optional


@dataclass
class Offer:
    title: str
    url: str
    source: str
    price: Optional[float] = None
    old_price: Optional[float] = None
    image_url: Optional[str] = None
    coupon: Optional[str] = None
    affiliate_url: Optional[str] = None
    extra: dict = field(default_factory=dict)

    @property
    def discount_percent(self) -> Optional[int]:
        if self.price and self.old_price and self.old_price > self.price:
            return round((1 - self.price / self.old_price) * 100)
        return None
