import { createContext, useContext, useState, type ReactNode } from 'react';

import type { Produto } from '@/data/mock';

export type ItemCarrinho = { produto: Produto; quantidade: number };

export type FormaPagamento = 'pix' | 'dinheiro' | 'cartao';

export type Pedido = {
  id: string;
  titulo: string; // nome da loja ou tipo de corrida
  emoji: string;
  descricao: string;
  total: number;
  pagamento: FormaPagamento;
  status: string;
  criadoEm: Date;
  whatsapp: string; // para quem o pedido foi enviado
  mensagem: string; // texto enviado (permite reenviar)
};

export type DadosCliente = { nome: string; endereco: string };

type Estado = {
  lojaDoCarrinho: string | null;
  itens: ItemCarrinho[];
  adicionar: (lojaId: string, produto: Produto) => void;
  remover: (produtoId: string) => void;
  limparCarrinho: () => void;
  pedidos: Pedido[];
  registrarPedido: (p: Omit<Pedido, 'id' | 'criadoEm' | 'status'>) => void;
  cliente: DadosCliente;
  setCliente: (c: DadosCliente) => void;
};

const AppContext = createContext<Estado | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lojaDoCarrinho, setLoja] = useState<string | null>(null);
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cliente, setCliente] = useState<DadosCliente>({ nome: '', endereco: '' });

  function adicionar(lojaId: string, produto: Produto) {
    // A sacola só pode ter itens de uma loja por vez (igual aos apps grandes)
    if (lojaDoCarrinho && lojaDoCarrinho !== lojaId) {
      setItens([{ produto, quantidade: 1 }]);
      setLoja(lojaId);
      return;
    }
    setLoja(lojaId);
    setItens((atual) => {
      const existe = atual.find((i) => i.produto.id === produto.id);
      if (existe) {
        return atual.map((i) => (i.produto.id === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i));
      }
      return [...atual, { produto, quantidade: 1 }];
    });
  }

  function remover(produtoId: string) {
    setItens((atual) => {
      const novo = atual
        .map((i) => (i.produto.id === produtoId ? { ...i, quantidade: i.quantidade - 1 } : i))
        .filter((i) => i.quantidade > 0);
      if (novo.length === 0) setLoja(null);
      return novo;
    });
  }

  function limparCarrinho() {
    setItens([]);
    setLoja(null);
  }

  function registrarPedido(p: Omit<Pedido, 'id' | 'criadoEm' | 'status'>) {
    setPedidos((atual) => [
      { ...p, id: String(Date.now()), criadoEm: new Date(), status: 'Enviado pelo WhatsApp' },
      ...atual,
    ]);
  }

  return (
    <AppContext.Provider
      value={{
        lojaDoCarrinho,
        itens,
        adicionar,
        remover,
        limparCarrinho,
        pedidos,
        registrarPedido,
        cliente,
        setCliente,
      }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp precisa estar dentro de <AppProvider>');
  return ctx;
}
