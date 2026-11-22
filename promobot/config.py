import json
import os
from dataclasses import dataclass, field

from dotenv import load_dotenv


def _bool(value: str, default: bool) -> bool:
    if value is None or value == "":
        return default
    return value.strip().lower() in {"1", "true", "yes", "sim", "on"}


@dataclass
class Config:
    telegram_bot_token: str = ""
    telegram_chat_id: str = ""
    amazon_tag: str = ""
    affiliate_params: dict = field(default_factory=dict)
    require_affiliate: bool = True
    rss_feeds: list = field(default_factory=list)
    dry_run: bool = True
    interval_seconds: int = 900
    max_posts_per_run: int = 5
    db_path: str = "promobot.db"

    @classmethod
    def from_env(cls) -> "Config":
        load_dotenv()
        env = os.environ.get
        return cls(
            telegram_bot_token=env("TELEGRAM_BOT_TOKEN", ""),
            telegram_chat_id=env("TELEGRAM_CHAT_ID", ""),
            amazon_tag=env("AMAZON_TAG", ""),
            affiliate_params=json.loads(env("AFFILIATE_PARAMS", "{}") or "{}"),
            require_affiliate=_bool(env("REQUIRE_AFFILIATE"), True),
            rss_feeds=[u.strip() for u in env("RSS_FEEDS", "").split(",") if u.strip()],
            dry_run=_bool(env("DRY_RUN"), True),
            interval_seconds=int(env("INTERVAL_SECONDS", "900")),
            max_posts_per_run=int(env("MAX_POSTS_PER_RUN", "5")),
            db_path=env("DB_PATH", "promobot.db"),
        )
