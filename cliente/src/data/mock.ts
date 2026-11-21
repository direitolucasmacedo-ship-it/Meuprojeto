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
  { id: 'restaurantes', nome: 'Restaurantes', emoji: '🍔', cor: '#FFE8D6', tipo: 'loja' },
  { id: 'mercado', nome: 'Mercado', emoji: '🛒', cor: '#E3F6E5', tipo: 'loja' },
  { id: 'farmacia', nome: 'Farmácia', emoji: '💊', cor: '#E3EEFF', tipo: 'loja' },
  { id: 'carro', nome: 'Carro', emoji: '🚗', cor: '#EDE7FF', tipo: 'corrida' },
  { id: 'moto', nome: 'Mototáxi', emoji: '🏍️', cor: '#FFF4CC', tipo: 'corrida' },
  { id: 'entregas', nome: 'Entregas', emoji: '📦', cor: '#FCE4EC', tipo: 'corrida' },
  { id: 'bebidas', nome: 'Bebidas', emoji: '🥤', cor: '#E0F7FA', tipo: 'loja' },
  { id: 'pet', nome: 'Pet shop', emoji: '🐶', cor: '#F1F8E9', tipo: 'loja' },
];

export type Produto = {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
};

export type Loja = {
  id: string;
  nome: string;
  categoria: CategoriaId;
  emoji: string;
  avaliacao: number;
  tempo: string; // tempo estimado de entrega
  taxaEntrega: number;
  aberta: boolean;
  produtos: Produto[];
};

export const LOJAS: Loja[] = [
  {
    id: 'sabor-mineiro',
    nome: 'Restaurante Sabor Mineiro',
    categoria: 'restaurantes',
    emoji: '🍲',
    avaliacao: 4.8,
    tempo: '30-45 min',
    taxaEntrega: 5,
    aberta: true,
    produtos: [
      { id: 'p1', nome: 'Marmitex completo', descricao: 'Arroz, feijão tropeiro, bife, salada e farofa', preco: 22 },
      { id: 'p2', nome: 'Frango com quiabo', descricao: 'Acompanha arroz e angu', preco: 26 },
      { id: 'p3', nome: 'Pão de queijo (10 un.)', descricao: 'Quentinho, feito na hora', preco: 12 },
      { id: 'p4', nome: 'Suco natural 500ml', descricao: 'Laranja, maracujá ou abacaxi', preco: 8 },
    ],
  },
  {
    id: 'lanchonete-praca',
    nome: 'Lanchonete da Praça',
    categoria: 'restaurantes',
    emoji: '🍔',
    avaliacao: 4.6,
    tempo: '25-40 min',
    taxaEntrega: 4,
    aberta: true,
    produtos: [
      { id: 'p1', nome: 'X-Tudo', descricao: 'Hambúrguer, ovo, bacon, presunto, queijo e salada', preco: 24 },
      { id: 'p2', nome: 'X-Salada', descricao: 'Hambúrguer, queijo e salada', preco: 17 },
      { id: 'p3', nome: 'Batata frita', descricao: 'Porção média', preco: 15 },
      { id: 'p4', nome: 'Refrigerante lata', descricao: '350ml', preco: 6 },
    ],
  },
  {
    id: 'pizzaria-forno',
    nome: 'Pizzaria Forno a Lenha',
    categoria: 'restaurantes',
    emoji: '🍕',
    avaliacao: 4.7,
    tempo: '40-55 min',
    taxaEntrega: 6,
    aberta: false,
    produtos: [
      { id: 'p1', nome: 'Pizza grande calabresa', descricao: '8 fatias', preco: 49 },
      { id: 'p2', nome: 'Pizza grande frango c/ catupiry', descricao: '8 fatias', preco: 55 },
    ],
  },
  {
    id: 'mercado-central',
    nome: 'Mercado Central',
    categoria: 'mercado',
    emoji: '🛒',
    avaliacao: 4.5,
    tempo: '40-60 min',
    taxaEntrega: 7,
    aberta: true,
    produtos: [
      { id: 'p1', nome: 'Arroz 5kg', descricao: 'Tipo 1', preco: 27.9 },
      { id: 'p2', nome: 'Feijão carioca 1kg', descricao: 'Tipo 1', preco: 8.5 },
      { id: 'p3', nome: 'Café 500g', descricao: 'Torrado e moído', preco: 18.9 },
      { id: 'p4', nome: 'Leite integral 1L', descricao: 'Caixa', preco: 5.6 },
      { id: 'p5', nome: 'Pão francês (kg)', descricao: 'Fresquinho', preco: 16 },
    ],
  },
  {
    id: 'farmacia-saude',
    nome: 'Farmácia Saúde & Vida',
    categoria: 'farmacia',
    emoji: '💊',
    avaliacao: 4.9,
    tempo: '20-35 min',
    taxaEntrega: 4,
    aberta: true,
    produtos: [
      { id: 'p1', nome: 'Dipirona 500mg', descricao: 'Caixa com 10 comprimidos', preco: 6.5 },
      { id: 'p2', nome: 'Protetor solar FPS 50', descricao: '120ml', preco: 39.9 },
      { id: 'p3', nome: 'Fralda infantil M', descricao: 'Pacote com 30', preco: 44.9 },
      { id: 'p4', nome: 'Álcool em gel 70%', descricao: '500ml', preco: 11.9 },
    ],
  },
  {
    id: 'deposito-gelada',
    nome: 'Depósito Gelada',
    categoria: 'bebidas',
    emoji: '🥤',
    avaliacao: 4.4,
    tempo: '20-30 min',
    taxaEntrega: 3,
    aberta: true,
    produtos: [
      { id: 'p1', nome: 'Água mineral 1,5L', descricao: 'Sem gás', preco: 4 },
      { id: 'p2', nome: 'Refrigerante 2L', descricao: 'Vários sabores', preco: 11 },
      { id: 'p3', nome: 'Gelo 5kg', descricao: 'Pacote', preco: 12 },
      { id: 'p4', nome: 'Botijão de gás P13', descricao: 'Troca do vasilhame', preco: 115 },
    ],
  },
  {
    id: 'pet-amigo',
    nome: 'Pet Amigo',
    categoria: 'pet',
    emoji: '🐶',
    avaliacao: 4.7,
    tempo: '30-50 min',
    taxaEntrega: 5,
    aberta: true,
    produtos: [
      { id: 'p1', nome: 'Ração cães adultos 10kg', descricao: 'Sabor carne', preco: 89.9 },
      { id: 'p2', nome: 'Areia para gatos 4kg', descricao: 'Granulada', preco: 19.9 },
    ],
  },
];

// Pontos de referência para as corridas (exemplos genéricos)
export const DESTINOS_POPULARES = [
  'Centro',
  'Rodoviária',
  'Hospital',
  'Praça da Matriz',
  'Prefeitura',
  'Feira livre',
];

// Preços de corrida de exemplo — o dono do app define os valores reais.
export const TARIFAS = {
  carro: { base: 8, porKm: 2.5, nome: 'Carro', emoji: '🚗' },
  moto: { base: 5, porKm: 1.6, nome: 'Mototáxi', emoji: '🏍️' },
  entregas: { base: 6, porKm: 1.8, nome: 'Entrega rápida', emoji: '📦' },
} as const;

export type TipoCorrida = keyof typeof TARIFAS;

export function formatarPreco(valor: number) {
  return 'R$ ' + valor.toFixed(2).replace('.', ',');
}
