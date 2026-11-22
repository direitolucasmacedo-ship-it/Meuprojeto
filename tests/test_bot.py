from promobot.affiliate import AffiliateLinker
from promobot.bot import PromoBot
from promobot.formatter import format_offer
from promobot.models import Offer
from promobot.publishers.base import Publisher
from promobot.sources.base import Source
from promobot.sources.rss import parse_brl
from promobot.storage import Storage


def test_amazon_tag_replaces_foreign_tag():
    linker = AffiliateLinker(amazon_tag="meuid-20")
    url = linker.build("https://www.amazon.com.br/dp/B0ABC?tag=outro-20&psc=1&th=1")
    assert "tag=meuid-20" in url
    assert "outro-20" not in url
    assert "th=1" in url


def test_custom_domain_params_and_unknown_store():
    linker = AffiliateLinker(affiliate_params={"loja.com.br": {"partner_id": "123"}})
    assert linker.build("https://www.loja.com.br/p/1?partner_id=999").endswith("partner_id=123")
    assert linker.build("https://outraloja.com/p/1") is None


def test_parse_brl_and_discount():
    assert parse_brl("De R$ 1.299,90 por R$ 999,00") == [1299.90, 999.0]
    assert Offer("x", "u", "s", price=50, old_price=100).discount_percent == 50


def test_formatter_escapes_html():
    text = format_offer(Offer("Fone <JBL>", "https://a", "s", price=99.9, affiliate_url="https://a?tag=x"))
    assert "&lt;JBL&gt;" in text and "R$ 99,90" in text


class FakeSource(Source):
    name = "fake"

    def fetch(self):
        return [
            Offer("Produto A", "https://www.amazon.com.br/dp/A", "fake", price=10),
            Offer("Produto B", "https://semafiliado.com/b", "fake", price=20),
        ]


class Collector(Publisher):
    def __init__(self):
        self.sent = []

    def publish(self, offer, text):
        self.sent.append(offer)


def test_bot_posts_only_affiliate_offers_once():
    pub = Collector()
    bot = PromoBot([FakeSource()], [pub], AffiliateLinker("meuid-20"), Storage(":memory:"))
    assert bot.run_once() == 1
    assert pub.sent[0].affiliate_url.endswith("tag=meuid-20")
    assert bot.run_once() == 0  # não repete
