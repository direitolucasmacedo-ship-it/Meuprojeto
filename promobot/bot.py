import logging
from typing import Iterable, List

from .affiliate import AffiliateLinker
from .formatter import format_offer
from .publishers.base import Publisher
from .sources.base import Source
from .storage import Storage

log = logging.getLogger(__name__)


class PromoBot:
    def __init__(self, sources: Iterable[Source], publishers: List[Publisher],
                 linker: AffiliateLinker, storage: Storage,
                 require_affiliate: bool = True, max_posts_per_run: int = 5):
        self.sources = list(sources)
        self.publishers = publishers
        self.linker = linker
        self.storage = storage
        self.require_affiliate = require_affiliate
        self.max_posts_per_run = max_posts_per_run

    def run_once(self) -> int:
        posted = 0
        for source in self.sources:
            try:
                offers = source.fetch()
            except Exception:
                log.exception("Erro na fonte %s", source.name)
                continue
            log.info("%s: %d ofertas encontradas", source.name, len(offers))

            for offer in offers:
                if posted >= self.max_posts_per_run:
                    return posted
                if self.storage.already_posted(offer.url):
                    continue
                offer.affiliate_url = self.linker.build(offer.url)
                if self.require_affiliate and not offer.affiliate_url:
                    log.debug("Sem link de afiliado, ignorando: %s", offer.url)
                    continue
                text = format_offer(offer)
                try:
                    for pub in self.publishers:
                        pub.publish(offer, text)
                except Exception:
                    log.exception("Falha ao publicar %s", offer.url)
                    continue
                self.storage.mark_posted(offer.url, offer.title)
                posted += 1
        return posted
