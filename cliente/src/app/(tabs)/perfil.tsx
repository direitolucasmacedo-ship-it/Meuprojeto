import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { WHATSAPP_CENTRAL } from '@/config';
import { useApp } from '@/context/app-state';
import { CIDADE, NOME_APP, cores } from '@/ui/theme';
import { abrirWhatsApp } from '@/whatsapp';

type Opcao = { emoji: string; texto: string; sub?: string; mensagem?: string };

const CONTA: Opcao[] = [
  { emoji: '📍', texto: 'Endereços', sub: 'Meus endereços de entrega' },
  { emoji: '💳', texto: 'Pagamentos', sub: 'Pix, dinheiro e cartão na entrega' },
  { emoji: '🔔', texto: 'Notificações', sub: 'Minha central de avisos' },
  { emoji: '💬', texto: 'Ajuda', sub: 'Fale com a gente pelo WhatsApp', mensagem: `Olá! Preciso de ajuda com o ${NOME_APP}.` },
];

const PARCEIROS: Opcao[] = [
  { emoji: '🏪', texto: 'Cadastre sua loja', sub: 'Restaurante, mercado, farmácia...', mensagem: `Olá! Quero cadastrar minha loja no ${NOME_APP}.` },
  { emoji: '🏍️', texto: 'Seja entregador ou mototaxista', sub: 'Ganhe fazendo entregas e corridas', mensagem: `Olá! Quero ser entregador/mototaxista no ${NOME_APP}.` },
  { emoji: '🚗', texto: 'Seja motorista', sub: 'Faça corridas de carro na cidade', mensagem: `Olá! Quero ser motorista no ${NOME_APP}.` },
];

function Lista({ opcoes }: { opcoes: Opcao[] }) {
  return (
    <View>
      {opcoes.map((o) => (
        <Pressable
          key={o.texto}
          onPress={() => o.mensagem && abrirWhatsApp(WHATSAPP_CENTRAL, o.mensagem)}
          style={({ pressed }) => [estilos.item, pressed && { backgroundColor: cores.fundoSuave }]}>
          <Text style={{ fontSize: 22 }}>{o.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={estilos.itemTexto}>{o.texto}</Text>
            {o.sub && <Text style={estilos.itemSub}>{o.sub}</Text>}
          </View>
          <Text style={{ color: cores.textoSuave, fontSize: 20 }}>›</Text>
        </Pressable>
      ))}
    </View>
  );
}

export default function Perfil() {
  const { cliente } = useApp();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: cores.fundo }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={estilos.topo}>
          <View style={estilos.avatar}>
            <Text style={{ fontSize: 30 }}>👤</Text>
          </View>
          <View>
            <Text style={estilos.nome}>{cliente.nome || 'Olá, visitante!'}</Text>
            <Text style={{ color: cores.textoSuave }}>{CIDADE}</Text>
          </View>
        </View>

        <Lista opcoes={CONTA} />

        <Text style={estilos.secao}>Trabalhe com a gente</Text>
        <Lista opcoes={PARCEIROS} />

        <Text style={{ textAlign: 'center', color: cores.textoSuave, fontSize: 12, marginTop: 24 }}>
          {NOME_APP} • versão 0.3 (protótipo)
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  topo: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, paddingTop: 20 },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: cores.fundoSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nome: { fontSize: 20, fontWeight: '700', color: cores.textoForte },
  secao: { fontSize: 16, fontWeight: '700', color: cores.textoForte, paddingHorizontal: 16, marginTop: 24, marginBottom: 4 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  itemTexto: { fontSize: 15, color: cores.textoForte },
  itemSub: { fontSize: 12, color: cores.textoSuave, marginTop: 2 },
});
