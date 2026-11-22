from html import escape

from .models import Offer


def _brl(value: float) -> str:
    s = f"{value:,.2f}"
    return "R$ " + s.replace(",", "X").replace(".", ",").replace("X", ".")


def format_offer(offer: Offer) -> str:
    """Mensagem em HTML (formato aceito pelo Telegram)."""
    lines = [f"🔥 <b>{escape(offer.title)}</b>", ""]
    if offer.old_price and offer.price and offer.old_price > offer.price:
        lines.append(f"De <s>{_brl(offer.old_price)}</s>")
    if offer.price:
        price_line = f"💰 Por <b>{_brl(offer.price)}</b>"
        if offer.discount_percent:
            price_line += f"  (-{offer.discount_percent}%)"
        lines.append(price_line)
    if offer.coupon:
        lines.append(f"🎟️ Cupom: <code>{escape(offer.coupon)}</code>")
    lines += ["", f"🛒 <a href=\"{escape(offer.affiliate_url or offer.url)}\">Comprar agora</a>", "",
              "<i>Preço sujeito a alteração. Link de afiliado.</i>"]
    return "\n".join(lines)
