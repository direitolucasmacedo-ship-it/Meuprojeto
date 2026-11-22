import argparse
import logging
import time

from .affiliate import AffiliateLinker
from .bot import PromoBot
from .config import Config
from .publishers.console import ConsolePublisher
from .publishers.telegram import TelegramPublisher
from .sources.rss import RSSSource
from .storage import Storage


def build_bot(cfg: Config) -> PromoBot:
    sources = [RSSSource(url) for url in cfg.rss_feeds]
    if cfg.dry_run:
        publishers = [ConsolePublisher()]
    else:
        publishers = [TelegramPublisher(cfg.telegram_bot_token, cfg.telegram_chat_id)]
    return PromoBot(
        sources=sources,
        publishers=publishers,
        linker=AffiliateLinker(cfg.amazon_tag, cfg.affiliate_params),
        storage=Storage(cfg.db_path),
        require_affiliate=cfg.require_affiliate,
        max_posts_per_run=cfg.max_posts_per_run,
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Robô de promoções com links de afiliado")
    parser.add_argument("--once", action="store_true", help="roda uma vez e sai")
    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    cfg = Config.from_env()
    if not cfg.rss_feeds:
        logging.warning("Nenhuma fonte configurada (RSS_FEEDS vazio no .env).")
    bot = build_bot(cfg)
    logging.info("Iniciando (modo %s)", "SIMULAÇÃO" if cfg.dry_run else "PUBLICAÇÃO")

    while True:
        n = bot.run_once()
        logging.info("%d ofertas publicadas nesta rodada", n)
        if args.once:
            break
        time.sleep(cfg.interval_seconds)


if __name__ == "__main__":
    main()
