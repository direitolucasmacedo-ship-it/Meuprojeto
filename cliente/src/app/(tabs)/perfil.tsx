import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CIDADE, NOME_APP, cores } from '@/ui/theme';

const OPCOES = [
  { emoji: '📍', texto: 'Meus endereços' },
  { emoji: '💳', texto: 'Formas de pagamento' },
  { emoji: '🔔', texto: 'Notificações' },
  { emoji: '💬', texto: 'Ajuda e suporte (WhatsApp)' },
];

const PARCEIROS = [
  { emoji: '🏪', texto: 'Cadastre sua loja, farmácia ou restaurante' },
  { emoji: '🏍️', texto: 'Seja entregador ou mototaxista' },
  { emoji: '🚗', texto: 'Seja motorista' },
];

export default function Perfil() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: cores.fundo }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <View style={estilos.topo}>
          <Text style={{ fontSize: 48 }}>👤</Text>
          <Text style={estilos.nome}>Visitante</Text>
          <Text style={{ color: cores.textoSuave }}>{CIDADE}</Text>
        </View>

        <View style={estilos.cartao}>
          {OPCOES.map((o) => (
            <Text key={o.texto} style={estilos.item}>
              {o.emoji}  {o.texto}
            </Text>
          ))}
        </View>

        <Text style={estilos.secao}>Trabalhe com a gente</Text>
        <View style={estilos.cartao}>
          {PARCEIROS.map((o) => (
            <Text key={o.texto} style={estilos.item}>
              {o.emoji}  {o.texto}
            </Text>
          ))}
        </View>

        <Text style={{ textAlign: 'center', color: cores.textoSuave, fontSize: 12, marginTop: 12 }}>
          {NOME_APP} · protótipo v0.1
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  topo: { alignItems: 'center', paddingVertical: 12, gap: 2 },
  nome: { fontSize: 20, fontWeight: '800', color: cores.texto },
  secao: { fontSize: 16, fontWeight: '700', color: cores.texto, marginTop: 6 },
  cartao: {
    backgroundColor: cores.cartao,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: cores.borda,
    paddingHorizontal: 14,
  },
  item: { paddingVertical: 14, fontSize: 15, color: cores.texto, borderBottomWidth: 1, borderBottomColor: cores.borda },
});
