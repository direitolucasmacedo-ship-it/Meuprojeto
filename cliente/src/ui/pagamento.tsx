import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { FormaPagamento } from '@/context/app-state';
import { cores } from '@/ui/theme';

export const PAGAMENTOS: { id: FormaPagamento; nome: string; detalhe: string; emoji: string }[] = [
  { id: 'pix', nome: 'Pix', detalhe: 'A loja envia a chave pelo WhatsApp', emoji: '⚡' },
  { id: 'dinheiro', nome: 'Dinheiro', detalhe: 'Pague na entrega', emoji: '💵' },
  { id: 'cartao', nome: 'Cartão', detalhe: 'Maquininha na entrega', emoji: '💳' },
];

export const NOME_PAGAMENTO: Record<FormaPagamento, string> = {
  pix: 'Pix',
  dinheiro: 'Dinheiro',
  cartao: 'Cartão na entrega',
};

export function EscolhaPagamento({ valor, onChange }: { valor: FormaPagamento; onChange: (f: FormaPagamento) => void }) {
  return (
    <View style={{ gap: 8 }}>
      {PAGAMENTOS.map((p) => {
        const ativo = valor === p.id;
        return (
          <Pressable key={p.id} onPress={() => onChange(p.id)} style={[estilos.opcao, ativo && estilos.opcaoAtiva]}>
            <Text style={{ fontSize: 22 }}>{p.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: cores.textoForte }}>{p.nome}</Text>
              <Text style={{ fontSize: 12, color: cores.textoSuave }}>{p.detalhe}</Text>
            </View>
            <View style={[estilos.radio, ativo && { borderColor: cores.primaria }]}>
              {ativo && <View style={estilos.radioMiolo} />}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const estilos = StyleSheet.create({
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: cores.cartao,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 8,
    padding: 14,
  },
  opcaoAtiva: { borderColor: cores.primaria },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#BDBDBD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioMiolo: { width: 10, height: 10, borderRadius: 5, backgroundColor: cores.primaria },
});
