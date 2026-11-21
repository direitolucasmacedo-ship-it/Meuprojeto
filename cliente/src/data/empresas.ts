// Guia de Capelinha: empresas, profissionais e utilidade pública.
// Empresas e profissionais aqui são de EXEMPLO (fictícios).
// Os números de EMERGÊNCIA (190, 192, 193...) são os oficiais do Brasil.
// Para cadastrar empresas reais, basta adicionar itens nesta lista
// (e, futuramente, pelo painel do administrador).

export type TipoEmpresa = 'varejo' | 'atacado' | 'servicos' | 'profissional' | 'publico';

export type Empresa = {
  id: string;
  nome: string;
  tipo: TipoEmpresa;
  ramo: string; // ex.: "Materiais de construção"
  emoji: string;
  descricao: string;
  endereco: string;
  horario: string;
  whatsapp?: string; // 55 + DDD + número
  telefone?: string; // 55 + DDD + número, ou número curto (ex.: '192')
  emergencia?: boolean;
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
  { id: 'profissional', nome: 'Profissionais' },
  { id: 'publico', nome: 'Utilidade pública' },
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

  // ---------- PROFISSIONAIS AUTÔNOMOS (exemplos) ----------
  {
    id: 'eletricista-marcos',
    nome: 'Marcos Eletricista',
    tipo: 'profissional',
    ramo: 'Eletricista',
    emoji: '💡',
    descricao: 'Instalações residenciais e comerciais, padrão Cemig, chuveiro, tomadas e manutenção.',
    endereco: 'Atende em toda a cidade',
    horario: 'Seg a Sáb 7h–19h',
    whatsapp: '5533900000017',
    verificada: true,
  },
  {
    id: 'pedreiro-antonio',
    nome: 'Antônio Pedreiro',
    tipo: 'profissional',
    ramo: 'Pedreiro e reformas',
    emoji: '🧱',
    descricao: 'Construção, reforma, reboco, piso e telhado. Orçamento sem compromisso.',
    endereco: 'Atende Capelinha e região',
    horario: 'Seg a Sex 7h–17h',
    whatsapp: '5533900000019',
  },
  {
    id: 'diarista-cida',
    nome: 'Cida Diarista',
    tipo: 'profissional',
    ramo: 'Diarista / faxina',
    emoji: '🧹',
    descricao: 'Faxina completa em casas e escritórios. Também passo roupa.',
    endereco: 'Atende bairros Centro e Vila Nova',
    horario: 'Seg a Sáb',
    whatsapp: '5533900000020',
  },
  {
    id: 'frete-ze',
    nome: 'Zé do Frete',
    tipo: 'profissional',
    ramo: 'Frete e mudança',
    emoji: '🛻',
    descricao: 'Fretes, mudanças e carretos com caminhonete. Cidade e zona rural.',
    endereco: 'Atende Capelinha e região',
    horario: 'Todos os dias',
    whatsapp: '5533900000021',
    telefone: '5533900000021',
  },

  // ---------- UTILIDADE PÚBLICA ----------
  // Emergência: números oficiais nacionais (funcionam em qualquer cidade)
  {
    id: 'samu',
    nome: 'SAMU',
    tipo: 'publico',
    ramo: 'Emergência médica',
    emoji: '🚑',
    descricao: 'Atendimento de urgência e emergência médica. Ligação gratuita, 24 horas.',
    endereco: 'Atendimento por telefone',
    horario: '24 horas',
    telefone: '192',
    emergencia: true,
  },
  {
    id: 'policia-militar',
    nome: 'Polícia Militar',
    tipo: 'publico',
    ramo: 'Emergência policial',
    emoji: '🚓',
    descricao: 'Emergências policiais, crimes em andamento. Ligação gratuita, 24 horas.',
    endereco: 'Atendimento por telefone',
    horario: '24 horas',
    telefone: '190',
    emergencia: true,
  },
  {
    id: 'bombeiros',
    nome: 'Corpo de Bombeiros',
    tipo: 'publico',
    ramo: 'Incêndio e resgate',
    emoji: '🚒',
    descricao: 'Incêndios, resgates e salvamentos. Ligação gratuita, 24 horas.',
    endereco: 'Atendimento por telefone',
    horario: '24 horas',
    telefone: '193',
    emergencia: true,
  },
  {
    id: 'defesa-civil',
    nome: 'Defesa Civil',
    tipo: 'publico',
    ramo: 'Desastres e riscos',
    emoji: '⛑️',
    descricao: 'Enchentes, deslizamentos, árvores caídas e áreas de risco.',
    endereco: 'Atendimento por telefone',
    horario: '24 horas',
    telefone: '199',
    emergencia: true,
  },
  {
    id: 'cemig',
    nome: 'Cemig (energia)',
    tipo: 'publico',
    ramo: 'Falta de energia',
    emoji: '⚡',
    descricao: 'Falta de luz, fios caídos e problemas na rede elétrica.',
    endereco: 'Atendimento por telefone',
    horario: '24 horas',
    telefone: '116',
  },
  {
    id: 'copasa',
    nome: 'Copasa (água)',
    tipo: 'publico',
    ramo: 'Água e esgoto',
    emoji: '💧',
    descricao: 'Falta de água, vazamentos e esgoto.',
    endereco: 'Atendimento por telefone',
    horario: '24 horas',
    telefone: '115',
  },
  // Órgãos locais: números FICTÍCIOS — substituir pelos oficiais de Capelinha
  {
    id: 'prefeitura',
    nome: 'Prefeitura Municipal',
    tipo: 'publico',
    ramo: 'Órgão público',
    emoji: '🏛️',
    descricao: 'Atendimento ao cidadão, protocolo, tributos e secretarias. (Número de exemplo)',
    endereco: 'Centro',
    horario: 'Seg a Sex 8h–17h',
    telefone: '5533900000030',
  },
  {
    id: 'hospital',
    nome: 'Hospital',
    tipo: 'publico',
    ramo: 'Saúde',
    emoji: '🏥',
    descricao: 'Pronto atendimento e internação. (Número de exemplo)',
    endereco: 'Capelinha',
    horario: '24 horas',
    telefone: '5533900000031',
  },
  {
    id: 'rodoviaria',
    nome: 'Rodoviária',
    tipo: 'publico',
    ramo: 'Transporte',
    emoji: '🚌',
    descricao: 'Horários e passagens de ônibus. (Número de exemplo)',
    endereco: 'Capelinha',
    horario: 'Todos os dias',
    telefone: '5533900000032',
  },
];
