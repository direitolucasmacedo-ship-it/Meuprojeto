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
  endereco?: string;
  horario?: string;
  whatsapp?: string; // 55 + DDD + número
  telefone?: string; // 55 + DDD + número, ou número curto (ex.: '192')
  outrosTelefones?: { rotulo: string; numero: string }[];
  email?: string;
  site?: string;
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
  // Fonte: sites de órgãos públicos e guias online (levantamento de nov/2025).
  // Alguns números podem mudar: confirmar periodicamente.

  // Emergência: números oficiais nacionais (ligação gratuita)
  { id: 'samu', nome: 'SAMU', tipo: 'publico', ramo: 'Emergência médica', emoji: '🚑', descricao: 'Urgência e emergência médica. Ligação gratuita, 24 horas.', horario: '24 horas', telefone: '192', emergencia: true },
  { id: 'policia-militar', nome: 'Polícia Militar', tipo: 'publico', ramo: 'Emergência policial', emoji: '🚓', descricao: 'Emergências policiais e crimes em andamento. Ligação gratuita, 24 horas.', horario: '24 horas', telefone: '190', emergencia: true },
  { id: 'bombeiros', nome: 'Corpo de Bombeiros', tipo: 'publico', ramo: 'Incêndio e resgate', emoji: '🚒', descricao: 'Incêndios, resgates e salvamentos. Ligação gratuita, 24 horas.', horario: '24 horas', telefone: '193', emergencia: true },
  { id: 'defesa-civil', nome: 'Defesa Civil', tipo: 'publico', ramo: 'Desastres e riscos', emoji: '⛑️', descricao: 'Enchentes, deslizamentos, árvores caídas e áreas de risco.', horario: '24 horas', telefone: '199', emergencia: true },
  { id: 'policia-civil-197', nome: 'Polícia Civil (denúncias)', tipo: 'publico', ramo: 'Polícia Civil', emoji: '🕵️', descricao: 'Disque-denúncia da Polícia Civil. Ligação gratuita.', telefone: '197' },
  { id: 'central-mulher', nome: 'Central de Atendimento à Mulher', tipo: 'publico', ramo: 'Violência contra a mulher', emoji: '💜', descricao: 'Denúncias e orientação para mulheres em situação de violência. Gratuito, 24 horas, sigiloso.', horario: '24 horas', telefone: '180' },
  { id: 'disque-denuncia', nome: 'Disque Denúncia', tipo: 'publico', ramo: 'Denúncia anônima', emoji: '📢', descricao: 'Denúncia anônima de crimes. Ligação gratuita.', telefone: '181' },
  { id: 'cemig', nome: 'Cemig (energia)', tipo: 'publico', ramo: 'Falta de energia', emoji: '⚡', descricao: 'Falta de luz, fios caídos e problemas na rede elétrica.', horario: '24 horas', telefone: '116' },
  { id: 'copasa', nome: 'Copasa (água)', tipo: 'publico', ramo: 'Água e esgoto', emoji: '💧', descricao: 'Falta de água, vazamentos e esgoto.', horario: '24 horas', telefone: '115' },

  // Prefeitura e Câmara
  {
    id: 'prefeitura',
    nome: 'Prefeitura de Capelinha',
    tipo: 'publico',
    ramo: 'Órgão público municipal',
    emoji: '🏛️',
    descricao: 'Atendimento ao cidadão, protocolo, tributos e secretarias.',
    endereco: 'Avenida Tico Neves, 1.455 - Vista Alegre',
    telefone: '08002230028',
    outrosTelefones: [{ rotulo: 'Gabinete', numero: '553335161348' }],
    email: 'comunicacao@pmcapelinha.mg.gov.br',
    site: 'https://pmcapelinha.mg.gov.br',
  },
  {
    id: 'secretaria-educacao',
    nome: 'Secretaria Municipal de Educação',
    tipo: 'publico',
    ramo: 'Educação',
    emoji: '🎓',
    descricao: 'Matrículas, escolas municipais e transporte escolar.',
    endereco: 'Rua Eunésio Dias Magalhães, 650 - Planalto',
    telefone: '553335161804',
  },
  {
    id: 'camara',
    nome: 'Câmara Municipal',
    tipo: 'publico',
    ramo: 'Poder Legislativo',
    emoji: '🏛️',
    descricao: 'Vereadores, sessões e projetos de lei do município.',
    endereco: 'Rua José Pimenta de Figueiredo, 5 - Centro',
    telefone: '553340425410',
  },

  // Saúde
  {
    id: 'hospital',
    nome: 'Fundação Hospitalar São Vicente de Paulo',
    tipo: 'publico',
    ramo: 'Hospital',
    emoji: '🏥',
    descricao: 'Pronto atendimento, obstetrícia, maternidade, internação e cirurgias.',
    endereco: 'Avenida JK, 221 - São Geraldo',
    horario: 'Pronto atendimento 24 horas',
    telefone: '553335161366',
  },

  // Segurança
  {
    id: 'delegacia-plantao',
    nome: 'Delegacia de Plantão e Delegacia da Mulher',
    tipo: 'publico',
    ramo: 'Polícia Civil',
    emoji: '👮',
    descricao: 'Registro de ocorrências 24 horas e atendimento especializado à mulher.',
    endereco: 'Rua Augusto Barbosa, 52 - Cidade Nova',
    horario: '24 horas',
    telefone: '553335161947',
  },
  {
    id: 'delegacia-regional',
    nome: 'Delegacia Regional de Polícia Civil',
    tipo: 'publico',
    ramo: 'Polícia Civil',
    emoji: '🏢',
    descricao: 'Delegacia Regional da Polícia Civil de Minas Gerais.',
    endereco: 'Rua Maria Moreira de Andrade, 355 - Acácias',
    telefone: '553335161187',
  },
  {
    id: 'posto-identificacao',
    nome: 'Posto de Identificação',
    tipo: 'publico',
    ramo: 'Carteira de identidade',
    emoji: '🪪',
    descricao: 'Emissão da carteira de identidade.',
    horario: '8h30 às 18h30',
    telefone: '553335161947',
  },

  // Justiça e cartórios
  {
    id: 'forum',
    nome: 'Fórum de Capelinha',
    tipo: 'publico',
    ramo: 'Justiça',
    emoji: '⚖️',
    descricao: 'Fórum da Comarca de Capelinha.',
    endereco: 'Rua das Hortências, 321 - Bouganville',
    telefone: '553335166900',
    outrosTelefones: [
      { rotulo: 'Telefone 2', numero: '553335166901' },
      { rotulo: 'Telefone 3', numero: '553335166902' },
    ],
  },
  {
    id: 'ministerio-publico',
    nome: 'Ministério Público (Promotorias)',
    tipo: 'publico',
    ramo: 'Justiça',
    emoji: '⚖️',
    descricao: 'Promotorias de Justiça da Comarca de Capelinha.',
    telefone: '553335161817',
    outrosTelefones: [{ rotulo: '2ª Promotoria', numero: '553335161929' }],
  },
  {
    id: 'cartorio-eleitoral',
    nome: 'Cartório Eleitoral',
    tipo: 'publico',
    ramo: 'Título de eleitor',
    emoji: '🗳️',
    descricao: 'Título de eleitor, biometria e transferência de domicílio eleitoral.',
    endereco: 'Rua Governador Valadares, 251',
    telefone: '553130109315',
  },
  { id: 'oab', nome: 'OAB Capelinha', tipo: 'publico', ramo: 'Ordem dos Advogados', emoji: '👨‍⚖️', descricao: 'Subseção da Ordem dos Advogados do Brasil.', telefone: '5533999189467' },
  {
    id: 'registro-civil',
    nome: 'Cartório de Registro Civil',
    tipo: 'publico',
    ramo: 'Cartório',
    emoji: '📜',
    descricao: 'Certidões de nascimento, casamento e óbito.',
    endereco: 'Av. Geraldo Prisco, 107',
    telefone: '553335161781',
  },
  { id: 'tabelionato-1', nome: '1º Tabelionato de Notas', tipo: 'publico', ramo: 'Cartório', emoji: '📜', descricao: 'Escrituras, procurações, reconhecimento de firma e autenticações.', telefone: '553335164462' },
  { id: 'tabelionato-2', nome: '2º Tabelionato de Notas e Protesto', tipo: 'publico', ramo: 'Cartório', emoji: '📜', descricao: 'Notas, protesto de títulos, reconhecimento de firma.', telefone: '553335164430' },
  { id: 'registro-imoveis', nome: 'Cartório de Registro de Imóveis', tipo: 'publico', ramo: 'Cartório', emoji: '🏠', descricao: 'Matrículas, registros e certidões de imóveis.', telefone: '553335164466' },

  // Órgãos estaduais
  {
    id: 'der',
    nome: 'DER-MG',
    tipo: 'publico',
    ramo: 'Estradas',
    emoji: '🛣️',
    descricao: 'Departamento de Estradas de Rodagem de Minas Gerais.',
    telefone: '553335166000',
    outrosTelefones: [{ rotulo: 'Telefone 2', numero: '553335161374' }],
  },
  {
    id: 'ima',
    nome: 'IMA',
    tipo: 'publico',
    ramo: 'Defesa agropecuária',
    emoji: '🐄',
    descricao: 'Instituto Mineiro de Agropecuária: vacinação, trânsito de animais e sanidade vegetal.',
    endereco: 'Rua Capitão Domingos Pimenta, 19',
    telefone: '553335162062',
  },
];
