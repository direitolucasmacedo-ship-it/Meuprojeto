import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '@/context/app-state';
import { formatarPreco } from '@/data/mock';
import { Botao } from '@/ui/componentes';
import { NOME_PAGAMENTO } from '@/ui/pagamento';
import { cores } from '@/ui/theme';
import { abrirWhatsApp } from '@/whatsapp';

export default function Pedidos() {
  const { pedidos } = useApp();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: cores.fundo }} edges={['top']}>
      <Text style={estilos.titulo}>Pedidos</Text>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {pedidos.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 60, gap: 6 }}>
            <Text style={{ fontSize: 56 }}>🧾</Text>
            <Text style={{ fontSize: 17, fontWeight: '700', color: cores.textoForte }}>Nenhum pedido ainda</Text>
            <Text style={{ color: cores.textoSuave, marginBottom: 16 }}>Que tal pedir algo gostoso agora?</Text>
            <Botao titulo="Ver lojas" onPress={() => router.navigate('/')} />
          </View>
        )}
        {pedidos.map((p) => (
          <View key={p.id} style={estilos.cartao}>
            <View style={estilos.cabecalho}>
              <View style={estilos.logo}>
                <Text style={{ fontSize: 22 }}>{p.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={estilos.nome} numberOfLines={1}>
                  {p.titulo}
                </Text>
                <Text style={estilos.desc}>
                  {p.criadoEm.toLocaleDateString('pt-BR')} às{' '}
                  {p.criadoEm.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
            <View style={estilos.status}>
              <Text style={{ color: cores.sucesso, fontWeight: '700', fontSize: 13 }}>✓ {p.status}</Text>
            </View>
            <Text style={estilos.desc}>{p.descricao}</Text>
            <View style={estilos.rodape}>
              <Text style={estilos.desc}>
                {NOME_PAGAMENTO[p.pagamento]} • <Text style={{ color: cores.textoForte, fontWeight: '700' }}>{formatarPreco(p.total)}</Text>
              </Text>
              <Pressable onPress={() => abrirWhatsApp(p.whatsapp, p.mensagem)} hitSlop={8}>
                <Text style={{ color: cores.primaria, fontWeight: '700', fontSize: 13 }}>Abrir no WhatsApp</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  titulo: {
    fontSize: 17,
    fontWeight: '700',
    color: cores.textoForte,
    textAlign: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  cartao: { borderRadius: 8, borderWidth: 1, borderColor: cores.borda, padding: 14, gap: 10 },
  cabecalho: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: cores.fundoSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nome: { fontSize: 15, fontWeight: '700', color: cores.textoForte },
  desc: { fontSize: 13, color: cores.textoSuave },
  status: { backgroundColor: '#EEF7F1', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6, alignSelf: 'flex-start' },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: cores.borda,
    paddingTop: 10,
  },
});
