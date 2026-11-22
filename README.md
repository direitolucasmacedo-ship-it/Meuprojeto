# PromoBot — robô de promoções com link de afiliado

Busca promoções, troca o link pelo **seu link de afiliado** e publica no seu canal/grupo do **Telegram**.

## Como funciona

```
Fontes (RSS / APIs de lojas)  →  troca para link de afiliado  →  formata a mensagem  →  publica no Telegram
                                         ↓
                          ignora ofertas já postadas (SQLite)
```

## Começando

```bash
pip install -r requirements.txt
cp .env.example .env      # preencha os valores
python -m promobot --once # roda uma vez (por padrão em modo SIMULAÇÃO)
python -m promobot        # roda em loop a cada INTERVAL_SECONDS
python -m pytest          # testes
```

### 1. Criar o bot do Telegram
1. No Telegram, fale com **@BotFather** → `/newbot` → copie o token para `TELEGRAM_BOT_TOKEN`.
2. Crie um **canal** (recomendado para promoções) ou grupo e adicione o bot como **administrador** com permissão de postar.
3. Em `TELEGRAM_CHAT_ID` use `@nome_do_canal` (canal público) ou o ID numérico (ex.: `-100...`).
4. Teste com `DRY_RUN=true`; quando estiver bom, mude para `DRY_RUN=false`.

### 2. Programas de afiliados
| Loja | Como gerar o link | Status no projeto |
|---|---|---|
| Amazon | parâmetro `tag=SEUID-20` | ✅ pronto (`AMAZON_TAG`) |
| Lojas com parâmetro na URL | `AFFILIATE_PARAMS` (JSON por domínio) | ✅ pronto |
| Mercado Livre, Shopee, AliExpress, Magalu | geram o link pelo portal/API de afiliados de cada um | ⏳ próximo passo |

Com `REQUIRE_AFFILIATE=true`, ofertas de lojas sem afiliado configurado **não são publicadas**
(e links de afiliado de terceiros são substituídos pelos seus).

### 3. Fontes de promoções
Hoje: qualquer feed RSS (`RSS_FEEDS`). Para adicionar uma fonte nova, crie uma classe em
`promobot/sources/` que herde de `Source` e implemente `fetch()` retornando uma lista de `Offer`.

## Estrutura

```
promobot/
  __main__.py      # ponto de entrada / loop
  bot.py           # orquestra: buscar → afiliar → deduplicar → publicar
  affiliate.py     # converte links em links de afiliado
  formatter.py     # texto da mensagem
  storage.py       # histórico do que já foi postado
  sources/         # de onde vêm as promoções
  publishers/      # para onde vão (Telegram, console)
tests/
```

## Sobre o WhatsApp
Bibliotecas que automatizam o WhatsApp comum (whatsapp-web.js, Baileys etc.) violam os termos
de uso e o número costuma ser **banido**. Caminhos seguros: WhatsApp Business Platform (API oficial,
paga) ou publicar manualmente/semiautomático em um Canal do WhatsApp. Por isso o Telegram vem primeiro.

## Cuidados
- Respeite as regras de cada programa de afiliados (ex.: a Amazon exige informar que o link é de afiliado — a mensagem já inclui isso).
- Use fontes que permitam reaproveitamento (APIs oficiais das lojas são o ideal); evite copiar conteúdo de sites que proíbem.
- Não exagere na frequência de posts para não cansar o grupo.
