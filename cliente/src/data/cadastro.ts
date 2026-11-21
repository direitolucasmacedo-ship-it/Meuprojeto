// Tipos de cadastro e categorias que a pessoa pode escolher ao pedir
// para entrar no app. Para incluir uma categoria nova, basta adicioná-la aqui.

export type GrupoId = 'empresa' | 'profissional' | 'colaborador' | 'contato';

export type Grupo = {
  id: GrupoId;
  nome: string;
  emoji: string;
  descricao: string;
  categorias: string[];
};

export const GRUPOS: Grupo[] = [
  {
    id: 'empresa',
    nome: 'Empresa ou comércio',
    emoji: '🏪',
    descricao: 'Loja, mercado, restaurante, atacado, clínica...',
    categorias: [
      'Restaurante / lanchonete',
      'Mercado / padaria',
      'Farmácia',
      'Bebidas e gás',
      'Roupas e calçados',
      'Materiais de construção',
      'Agropecuária',
      'Pet shop',
      'Atacado / distribuidora',
      'Beleza e estética',
      'Saúde (clínica, consultório)',
      'Educação (escola, curso)',
      'Automotivo (oficina, peças)',
      'Outro',
    ],
  },
  {
    id: 'profissional',
    nome: 'Profissional autônomo',
    emoji: '🧰',
    descricao: 'Eletricista, pedreiro, diarista, manicure...',
    categorias: [
      'Eletricista',
      'Pedreiro',
      'Encanador',
      'Pintor',
      'Diarista / faxina',
      'Manicure / cabeleireira',
      'Técnico de celular ou informática',
      'Frete e mudança',
      'Professor particular',
      'Costureira',
      'Jardineiro',
      'Outro',
    ],
  },
  {
    id: 'colaborador',
    nome: 'Mototaxista ou entregador',
    emoji: '🏍️',
    descricao: 'Quero fazer corridas e entregas pelo app',
    categorias: ['Mototaxista', 'Entregador de moto', 'Entregador de bicicleta', 'Motorista (carro)', 'Outro'],
  },
  {
    id: 'contato',
    nome: 'Falar com a gente',
    emoji: '💬',
    descricao: 'Dúvida, sugestão, reclamação ou parceria',
    categorias: ['Dúvida', 'Sugestão', 'Reclamação', 'Parceria / anúncio', 'Outro'],
  },
];
