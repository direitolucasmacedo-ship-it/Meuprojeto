"""Fonte manual: uma planilha (ofertas.csv) que você mesmo preenche."""
import csv
import logging
import os
import re
from typing import List, Optional

from ..models import Offer
from .base import Source

log = logging.getLogger(__name__)


def parse_price(text: str) -> Optional[float]:
    """Aceita '279,00', 'R$ 1.299,90', '279.00' ou vazio."""
    text = re.sub(r"[^\d,.]", "", text or "")
    if not text:
        return None
    if "," in text:
        text = text.replace(".", "").replace(",", ".")
    try:
        return float(text)
    except ValueError:
        return None


class CSVSource(Source):
    """Colunas: titulo;link;preco;preco_antigo;cupom;imagem (separadas por ponto e vírgula)."""

    def __init__(self, path: str):
        self.path = path
        self.name = f"planilha:{os.path.basename(path)}"

    def fetch(self) -> List[Offer]:
        if not os.path.exists(self.path):
            log.warning("Planilha %s não encontrada", self.path)
            return []
        offers = []
        with open(self.path, encoding="utf-8-sig", newline="") as f:
            for row in csv.DictReader(f, delimiter=";"):
                row = {(k or "").strip().lower(): (v or "").strip() for k, v in row.items()}
                if not row.get("titulo") or not row.get("link"):
                    continue
                offers.append(Offer(
                    title=row["titulo"],
                    url=row["link"],
                    source=self.name,
                    price=parse_price(row.get("preco", "")),
                    old_price=parse_price(row.get("preco_antigo", "")),
                    coupon=row.get("cupom") or None,
                    image_url=row.get("imagem") or None,
                ))
        return offers
