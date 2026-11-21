// Dados de EXEMPLO para o protótipo. Nenhuma loja aqui é real.
// Na próxima etapa estes dados virão do servidor (backend).

export type CategoriaId =
  | 'restaurantes'
  | 'mercado'
  | 'farmacia'
  | 'carro'
  | 'moto'
  | 'entregas'
  | 'bebidas'
  | 'pet';

export type Categoria = {
  id: CategoriaId;
  nome: string;
  emoji: string;
  cor: string;
  // "loja" = lista de estabelecimentos; "corrida" = transporte
  tipo: 'loja' | 'corrida';
};

export const CATEGORIAS: Categoria[] = [
  { id: 'restaurantes', nome: 'Restaurantes', emoji: '🍔', cor: '#FFE9E0', tipo: 'loja' },
  { id: 'mercado', nome: 'Mercado', emoji: '🛒', cor: '#E5F5E8', tipo: 'loja' },
  { id: 'farmacia', nome: 'Farmácia', emoji: '💊', cor: '#E5EFFF', tipo: 'loja' },
  { id: 'moto', nome: 'Mototáxi', emoji: '🏍️', cor: '#FFF5D6', tipo: 'corrida' },
  { id: 'carro', nome: 'Carro', emoji: '🚗', cor: '#EEE8FF', tipo: 'corrida' },
  { id: 'entregas', nome: 'Entregas', emoji: '📦', cor: '#FCE6EE', tipo: 'corrida' },
  { id: 'bebidas', nome: 'Bebidas', emoji: '🥤', cor: '#E0F6F8', tipo: 'loja' },
  { id: 'pet', nome: 'Pet shop', emoji: '🐶', cor: '#EEF6E4', tipo: 'loja' },
];

export type Produto = {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  emoji: string;
  precoAntigo?: number; // para mostrar promoção
};

export type Loja = {
  id: string;
  nome: string;
  categoria: CategoriaId;
  segmento: string; // ex.: "Lanches", "Comida mineira"
  emoji: string;
  corCapa: string;
  avaliacao: number;
  distanciaKm: number;
  tempo: string; // tempo estimado de entrega
  taxaEntrega: number; // 0 = entrega grátis
  pedidoMinimo: number;
  aberta: boolean;
  whatsapp?: string; // se vazio, o pedido vai para a central
  produtos: Produto[];
};

export const LOJAS: Loja[] = [
  {
    id: 'sabor-mineiro',
    nome: 'Restaurante Sabor Mineiro',
    categoria: 'restaurantes',
    segmento: 'Comida mineira',
    emoji: '🍲',
    corCapa: '#8D5A3B',
    avaliacao: 4.8,
    distanciaKm: 1.2,
    tempo: '30-45 min',
    taxaEntrega: 0,
    pedidoMinimo: 15,
    aberta: true,
    produtos: [
      { id: 'p1', nome: 'Marmitex completo', descricao: 'Arroz, feijão tropeiro, bife acebolado, salada e farofa', preco: 22, precoAntigo: 25, emoji: '🍱' },
      { id: 'p2', nome: 'Frango com quiabo', descricao: 'Acompanha arroz e angu. Serve 1 pessoa', preco: 26, emoji: '🍗' },
      { id: 'p3', nome: 'Pão de queijo (10 un.)', descricao: 'Quentinho, feito na hora', preco: 12, emoji: '🧀' },
      { id: 'p4', nome: 'Suco natural 500ml', descricao: 'Laranja, maracujá ou abacaxi', preco: 8, emoji: '🧃' },
    ],
  },
  {
    id: 'lanchonete-praca',
    nome: 'Lanchonete da Praça',
    categoria: 'restaurantes',
    segmento: 'Lanches',
    emoji: '🍔',
    corCapa: '#C0392B',
    avaliacao: 4.6,
    distanciaKm: 0.8,
    tempo: '25-40 min',
    taxaEntrega: 4,
    pedidoMinimo: 10,
    aberta: true,
    produtos: [
      { id: 'p1', nome: 'X-Tudo', descricao: 'Hambúrguer, ovo, bacon, presunto, queijo, alface e tomate', preco: 24, emoji: '🍔' },
      { id: 'p2', nome: 'X-Salada', descricao: 'Hambúrguer, queijo, alface e tomate', preco: 17, emoji: '🍔' },
      { id: 'p3', nome: 'Batata frita', descricao: 'Porção média, com cheddar e bacon', preco: 15, precoAntigo: 19, emoji: '🍟' },
      { id: 'p4', nome: 'Refrigerante lata', descricao: '350ml', preco: 6, emoji: '🥤' },
    ],
  },
  {
    id: 'pizzaria-forno',
    nome: 'Pizzaria Forno a Lenha',
    categoria: 'restaurantes',
    segmento: 'Pizza',
    emoji: '🍕',
    corCapa: '#D35400',
    avaliacao: 4.7,
    distanciaKm: 2.1,
    tempo: '40-55 min',
    taxaEntrega: 6,
    pedidoMinimo: 30,
    aberta: false,
    produtos: [
      { id: 'p1', nome: 'Pizza grande calabresa', descricao: '8 fatias', preco: 49, emoji: '🍕' },
      { id: 'p2', nome: 'Pizza grande frango c/ catupiry', descricao: '8 fatias', preco: 55, emoji: '🍕' },
    ],
  },
  {
    id: 'mercado-central',
    nome: 'Mercado Central',
    categoria: 'mercado',
    segmento: 'Mercado',
    emoji: '🛒',
    corCapa: '#27AE60',
    avaliacao: 4.5,
    distanciaKm: 1.5,
    tempo: '40-60 min',
    taxaEntrega: 7,
    pedidoMinimo: 30,
    aberta: true,
    produtos: [
      { id: 'p1', nome: 'Arroz 5kg', descricao: 'Tipo 1', preco: 27.9, emoji: '🍚' },
      { id: 'p2', nome: 'Feijão carioca 1kg', descricao: 'Tipo 1', preco: 8.5, emoji: '🫘' },
      { id: 'p3', nome: 'Café 500g', descricao: 'Torrado e moído', preco: 18.9, precoAntigo: 21.9, emoji: '☕' },
      { id: 'p4', nome: 'Leite integral 1L', descricao: 'Caixa', preco: 5.6, emoji: '🥛' },
      { id: 'p5', nome: 'Pão francês (kg)', descricao: 'Fresquinho', preco: 16, emoji: '🥖' },
    ],
  },
  {
    id: 'farmacia-saude',
    nome: 'Farmácia Saúde & Vida',
    categoria: 'farmacia',
    segmento: 'Farmácia',
    emoji: '💊',
    corCapa: '#2E86DE',
    avaliacao: 4.9,
    distanciaKm: 0.6,
    tempo: '20-35 min',
    taxaEntrega: 0,
    pedidoMinimo: 10,
    aberta: true,
    produtos: [
      { id: 'p1', nome: 'Dipirona 500mg', descricao: 'Caixa com 10 comprimidos', preco: 6.5, emoji: '💊' },
      { id: 'p2', nome: 'Protetor solar FPS 50', descricao: '120ml', preco: 39.9, emoji: '🧴' },
      { id: 'p3', nome: 'Fralda infantil M', descricao: 'Pacote com 30', preco: 44.9, emoji: '👶' },
      { id: 'p4', nome: 'Álcool em gel 70%', descricao: '500ml', preco: 11.9, emoji: '🧼' },
    ],
  },
  {
    id: 'deposito-gelada',
    nome: 'Depósito Gelada',
    categoria: 'bebidas',
    segmento: 'Bebidas e gás',
    emoji: '🥤',
    corCapa: '#16A085',
    avaliacao: 4.4,
    distanciaKm: 1.9,
    tempo: '20-30 min',
    taxaEntrega: 3,
    pedidoMinimo: 10,
    aberta: true,
    produtos: [
      { id: 'p1', nome: 'Água mineral 1,5L', descricao: 'Sem gás', preco: 4, emoji: '💧' },
      { id: 'p2', nome: 'Refrigerante 2L', descricao: 'Vários sabores', preco: 11, emoji: '🥤' },
      { id: 'p3', nome: 'Gelo 5kg', descricao: 'Pacote', preco: 12, emoji: '🧊' },
      { id: 'p4', nome: 'Botijão de gás P13', descricao: 'Troca do vasilhame', preco: 115, emoji: '🔥' },
    ],
  },
  {
    id: 'pet-amigo',
    nome: 'Pet Amigo',
    categoria: 'pet',
    segmento: 'Pet shop',
    emoji: '🐶',
    corCapa: '#8E44AD',
    avaliacao: 4.7,
    distanciaKm: 2.4,
    tempo: '30-50 min',
    taxaEntrega: 5,
    pedidoMinimo: 20,
    aberta: true,
    produtos: [
      { id: 'p1', nome: 'Ração cães adultos 10kg', descricao: 'Sabor carne', preco: 89.9, emoji: '🦴' },
      { id: 'p2', nome: 'Areia para gatos 4kg', descricao: 'Granulada', preco: 19.9, emoji: '🐱' },
    ],
  },
];

export type Banner = {
  id: string;
  titulo: string;
  subtitulo: string;
  emoji: string;
  cor: string;
  // para onde o banner leva
  destino: { tipo: 'loja'; id: string } | { tipo: 'categoria'; id: CategoriaId } | { tipo: 'corrida'; id: TipoCorrida };
};

export const BANNERS: Banner[] = [
  { id: 'b1', titulo: 'Entrega grátis', subtitulo: 'no Sabor Mineiro hoje', emoji: '🍲', cor: '#1463F3', destino: { tipo: 'loja', id: 'sabor-mineiro' } },
  { id: 'b2', titulo: 'Farmácia rápida', subtitulo: 'remédio sem sair de casa', emoji: '💊', cor: '#0A2A66', destino: { tipo: 'categoria', id: 'farmacia' } },
  { id: 'b3', titulo: 'Gás e água', subtitulo: 'entrega no mesmo dia', emoji: '🔥', cor: '#0E9F9A', destino: { tipo: 'loja', id: 'deposito-gelada' } },
];

// Pontos de referência para as corridas (exemplos genéricos)
export const DESTINOS_POPULARES = ['Centro', 'Rodoviária', 'Hospital', 'Praça da Matriz', 'Prefeitura', 'Feira livre'];

// Preços de corrida de exemplo — o dono do app define os valores reais.
export const TARIFAS = {
  moto: { base: 5, porKm: 1.6, nome: 'Mototáxi', emoji: '🏍️' },
  carro: { base: 8, porKm: 2.5, nome: 'Carro', emoji: '🚗' },
  entregas: { base: 6, porKm: 1.8, nome: 'Entrega rápida', emoji: '📦' },
} as const;

export type TipoCorrida = keyof typeof TARIFAS;

export function formatarPreco(valor: number) {
  return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

export function formatarKm(km: number) {
  return km.toFixed(1).replace('.', ',') + ' km';
}
