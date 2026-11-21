# Capelinha Já (nome provisório)

Super app de delivery e transporte para **Capelinha - MG**: restaurantes, mercado, farmácia,
bebidas, pet shop, corrida de carro, mototáxi e entregas rápidas.

> **Situação atual:** protótipo do **App do Cliente** com dados de exemplo.
> As lojas cadastradas são fictícias, os pedidos ainda não chegam a ninguém
> e a distância das corridas é simulada.

## Telas

| Início | Loja | Carrinho | Pedidos | Corrida |
|---|---|---|---|---|
| ![](docs/telas/1-inicio.png) | ![](docs/telas/2-loja.png) | ![](docs/telas/3-carrinho.png) | ![](docs/telas/4-pedidos.png) | ![](docs/telas/5-corrida.png) |

## Como testar no seu celular

Você precisa de um computador com [Node.js](https://nodejs.org) (versão LTS) instalado.

1. No celular, instale o app **Expo Go** (Play Store ou App Store).
2. No computador, baixe este repositório e rode:
   ```bash
   cd cliente
   npm install
   npx expo start
   ```
3. Vai aparecer um **QR code** no terminal. Leia com o Expo Go (Android) ou com a câmera (iPhone).
   O celular e o computador precisam estar na mesma rede Wi-Fi.

Para ver no navegador do computador: `npx expo start --web`.

## Estrutura

```
cliente/                 App do cliente (React Native + Expo)
  src/app/               Telas (cada arquivo é uma tela)
    (tabs)/index.tsx     Início: categorias, busca, lojas abertas
    (tabs)/pedidos.tsx   Meus pedidos
    (tabs)/perfil.tsx    Perfil e "Trabalhe com a gente"
    categoria/[id].tsx   Lista de lojas de uma categoria
    loja/[id].tsx        Cardápio/produtos da loja
    carrinho.tsx         Carrinho, endereço e pagamento
    corrida.tsx          Pedir carro, mototáxi ou entrega
  src/data/mock.ts       Lojas, produtos e tarifas de EXEMPLO
  src/context/           Estado do carrinho e pedidos
  src/ui/                Cores, componentes reutilizáveis
```

## Próximas etapas

1. **Protótipo do cliente** ✅
2. **Servidor (backend):** login por telefone/SMS, banco de dados, pedidos reais
3. **App do entregador/motorista** e **painel das lojas**
4. **Mapa e GPS:** distância real, acompanhar o motoboy em tempo real
5. **Pagamento online** (Pix/cartão) e repasse para parceiros
6. **Publicação** na Play Store e App Store
