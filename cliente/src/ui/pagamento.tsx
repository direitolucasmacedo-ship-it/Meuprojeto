import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { FormaPagamento } from '@/context/app-state';
import { cores } from '@/ui/theme';

export const PAGAMENTOS: { id: FormaPagamento; nome: string; emoji: string }[] = [
  { id: 'pix', nome: 'Pix', emoji: '⚡' },
  { id: 'dinheiro', nome: 'Dinheiro na entrega', emoji: '💵' },
  { id: 'cartao', nome: 'Cartão na entrega (maquininha)', emoji: '💳' },
];

export function EscolhaPagamento({ valor, onChange }: { valor: FormaPagamento; onChange: (f: FormaPagamento) => void }) {
  return (
    <View style={{ gap: 8 }}>
      {PAGAMENTOS.map((p) => (
        <Pressable
          key={p.id}
          onPress={() => onChange(p.id)}
          style={[estilos.opcao, valor === p.id && estilos.opcaoAtiva]}>
          <Text style={{ fontSize: 15, color: cores.texto }}>
            {p.emoji} {p.nome}
          </Text>
          <Text style={{ color: cores.primaria, fontSize: 18 }}>{valor === p.id ? '●' : '○'}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  opcao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: cores.cartao,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 12,
    padding: 14,
  },
  opcaoAtiva: { borderColor: cores.primaria, borderWidth: 2 },
});
