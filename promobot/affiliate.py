"""Transforma o link da loja no SEU link de afiliado."""
from typing import Optional
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse

# Parâmetros de rastreio de terceiros que removemos para não "dar" a comissão a outro afiliado
TRACKING_PARAMS = {
    "tag", "ascsubtag", "linkcode", "linkid", "ref", "ref_", "psc", "smid",
    "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
    "partner_id", "affiliate_id", "aff_id", "matt_tool", "matt_word",
}

AMAZON_DOMAINS = ("amazon.com.br", "amazon.com", "amzn.to")


def _domain_matches(host: str, domain: str) -> bool:
    host = host.lower()
    return host == domain or host.endswith("." + domain)


def _clean_query(query: str) -> list:
    return [(k, v) for k, v in parse_qsl(query, keep_blank_values=True)
            if k.lower() not in TRACKING_PARAMS]


class AffiliateLinker:
    def __init__(self, amazon_tag: str = "", affiliate_params: Optional[dict] = None):
        self.amazon_tag = amazon_tag
        self.affiliate_params = affiliate_params or {}

    def build(self, url: str) -> Optional[str]:
        """Retorna o link com seu ID de afiliado, ou None se a loja não estiver configurada."""
        parts = urlparse(url)
        host = parts.hostname or ""

        if self.amazon_tag and any(_domain_matches(host, d) for d in AMAZON_DOMAINS):
            if _domain_matches(host, "amzn.to"):
                return None  # link encurtado de outra pessoa: precisa ser expandido antes
            query = _clean_query(parts.query) + [("tag", self.amazon_tag)]
            return urlunparse(parts._replace(query=urlencode(query)))

        for domain, params in self.affiliate_params.items():
            if _domain_matches(host, domain):
                query = _clean_query(parts.query) + list(params.items())
                return urlunparse(parts._replace(query=urlencode(query)))

        return None
