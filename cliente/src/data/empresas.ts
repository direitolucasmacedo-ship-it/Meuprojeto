// Guia comercial de Capelinha — empresas de EXEMPLO (fictícias).
// Para cadastrar empresas reais, basta adicionar itens nesta lista
// (e, futuramente, pelo painel do administrador).

export type TipoEmpresa = 'varejo' | 'atacado' | 'servicos';

export type Empresa = {
  id: string;
  nome: string;
  tipo: TipoEmpresa;
  ramo: string; // ex.: "Materiais de construção"
  emoji: string;
  descricao: string;
  endereco: string;
  horario: string;
  whatsapp: string; // 55 + DDD + número
  telefone?: string;
  instagram?: string;
  fazEntrega?: boolean;
  lojaId?: string; // se tiver cardápio/produtos no delivery
  verificada?: boolean;
};

export const TIPOS: { id: TipoEmpresa | 'todos'; nome: string }[] = [
  { id: 'todos', nome: 'Todas' },
  { id: 'varejo', nome: 'Varejo' },
  { id: 'atacado', nome: 'Atacado' },
  { id: 'servicos', nome: 'Serviços' },
];

export const EMPRESAS: Empresa[] = [
  {
    id: 'distribuidora-vale',
    nome: 'Distribuidora Vale do Jequitinhonha',
    tipo: 'atacado',
    ramo: 'Alimentos e bebidas',
    emoji: '🚚',
    descricao: 'Atacado de alimentos, bebidas e produtos de limpeza para mercados, bares e restaurantes.',
    endereco: 'Av. Exemplo, 1000 - Distrito Industrial',
    horario: 'Seg a Sex 7h–17h • Sáb 7h–11h',
    whatsapp: '5533900000010',
    telefone: '5533900000010',
    fazEntrega: true,
    verificada: true,
  },
  {
    id: 'atacadao-cafe',
    nome: 'Armazém do Café',
    tipo: 'atacado',
    ramo: 'Café e grãos',
    emoji: '☕',
    descricao: 'Compra e venda de café, feijão e milho. Atendemos produtores e comércios da região.',
    endereco: 'Rodovia Exemplo, km 5',
    horario: 'Seg a Sex 7h–17h',
    whatsapp: '5533900000011',
  },
  {
    id: 'casa-construcao',
    nome: 'Casa & Construção',
    tipo: 'varejo',
    ramo: 'Materiais de construção',
    emoji: '🧱',
    descricao: 'Cimento, areia, ferragens, tintas, hidráulica e elétrica. Entregamos na obra.',
    endereco: 'Rua Exemplo, 250 - Centro',
    horario: 'Seg a Sex 7h–18h • Sáb 7h–12h',
    whatsapp: '5533900000012',
    telefone: '5533900000012',
    fazEntrega: true,
    verificada: true,
  },
  {
    id: 'moda-centro',
    nome: 'Moda Centro',
    tipo: 'varejo',
    ramo: 'Roupas e calçados',
    emoji: '👗',
    descricao: 'Moda feminina, masculina e infantil. Novidades toda semana.',
    endereco: 'Rua Exemplo, 88 - Centro',
    horario: 'Seg a Sáb 8h–18h',
    whatsapp: '5533900000013',
    instagram: 'modacentro',
  },
  {
    id: 'agro-capelinha',
    nome: 'Agropecuária Boa Safra',
    tipo: 'varejo',
    ramo: 'Agropecuária',
    emoji: '🌱',
    descricao: 'Rações, sementes, adubos, ferramentas e medicamentos veterinários.',
    endereco: 'Rua Exemplo, 400 - Vila Nova',
    horario: 'Seg a Sex 7h–18h • Sáb 7h–12h',
    whatsapp: '5533900000014',
    fazEntrega: true,
  },
  {
    id: 'cell-tech',
    nome: 'Cell Tech Assistência',
    tipo: 'servicos',
    ramo: 'Conserto de celulares',
    emoji: '📱',
    descricao: 'Troca de tela, bateria e conector. Acessórios e películas.',
    endereco: 'Praça Exemplo, 12 - Centro',
    horario: 'Seg a Sáb 8h–18h',
    whatsapp: '5533900000015',
    verificada: true,
  },
  {
    id: 'auto-mecanica',
    nome: 'Auto Mecânica Irmãos',
    tipo: 'servicos',
    ramo: 'Mecânica de carros e motos',
    emoji: '🔧',
    descricao: 'Revisão, freios, suspensão e troca de óleo. Socorro na cidade.',
    endereco: 'Rua Exemplo, 900 - Bairro Novo',
    horario: 'Seg a Sex 7h30–18h • Sáb 7h30–12h',
    whatsapp: '5533900000016',
    telefone: '5533900000016',
  },
  {
    id: 'eletrica-luz',
    nome: 'Luz Elétrica & Instalações',
    tipo: 'servicos',
    ramo: 'Eletricista',
    emoji: '💡',
    descricao: 'Instalações residenciais e comerciais, padrão Cemig e manutenção.',
    endereco: 'Atende em toda a cidade',
    horario: 'Seg a Sáb 7h–19h',
    whatsapp: '5533900000017',
  },
  {
    id: 'farmacia-saude',
    nome: 'Farmácia Saúde & Vida',
    tipo: 'varejo',
    ramo: 'Farmácia',
    emoji: '💊',
    descricao: 'Medicamentos, perfumaria e dermocosméticos. Peça pelo delivery do app!',
    endereco: 'Rua Exemplo, 15 - Centro',
    horario: 'Todos os dias 7h–22h',
    whatsapp: '5533900000018',
    fazEntrega: true,
    lojaId: 'farmacia-saude',
    verificada: true,
  },
];
