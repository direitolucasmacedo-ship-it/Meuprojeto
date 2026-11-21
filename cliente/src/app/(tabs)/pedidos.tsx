import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '@/context/app-state';
import { formatarPreco } from '@/data/mock';
import { cores } from '@/ui/theme';

const NOME_PAGAMENTO = { pix: 'Pix', dinheiro: 'Dinheiro', cartao: 'Cartão na entrega' };

export default function Pedidos() {
  const { pedidos } = useApp();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: cores.fundo }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
        <Text style={estilos.titulo}>Meus pedidos</Text>
        {pedidos.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Text style={{ fontSize: 48 }}>🧾</Text>
            <Text style={{ color: cores.textoSuave, marginTop: 8 }}>Você ainda não fez nenhum pedido.</Text>
          </View>
        )}
        {pedidos.map((p) => (
          <View key={p.id} style={estilos.cartao}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={estilos.nome}>
                {p.emoji} {p.titulo}
              </Text>
              <Text style={estilos.total}>{formatarPreco(p.total)}</Text>
            </View>
            <Text style={estilos.desc}>{p.descricao}</Text>
            <Text style={estilos.desc}>
              {NOME_PAGAMENTO[p.pagamento]} ·{' '}
              {p.criadoEm.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <Text style={estilos.status}>⏳ {p.status}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  titulo: { fontSize: 24, fontWeight: '800', color: cores.texto, marginBottom: 6 },
  cartao: {
    backgroundColor: cores.cartao,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: 14,
    gap: 4,
  },
  nome: { fontSize: 16, fontWeight: '700', color: cores.texto, flexShrink: 1 },
  total: { fontSize: 16, fontWeight: '700', color: cores.texto },
  desc: { fontSize: 13, color: cores.textoSuave },
  status: { fontSize: 13, color: cores.primaria, fontWeight: '700', marginTop: 4 },
});
