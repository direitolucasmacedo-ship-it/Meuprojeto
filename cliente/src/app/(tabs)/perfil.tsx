import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '@/context/app-state';
import type { GrupoId } from '@/data/cadastro';
import { CIDADE, NOME_APP, cores } from '@/ui/theme';

type Opcao = { emoji: string; texto: string; sub?: string; grupo?: GrupoId };

const CONTA: Opcao[] = [
  { emoji: '📍', texto: 'Endereços', sub: 'Meus endereços de entrega' },
  { emoji: '💳', texto: 'Pagamentos', sub: 'Pix, dinheiro e cartão na entrega' },
  { emoji: '🔔', texto: 'Notificações', sub: 'Minha central de avisos' },
];

const PARCEIROS: Opcao[] = [
  { emoji: '🏪', texto: 'Cadastre sua empresa', sub: 'Comércio, atacado, varejo, clínica...', grupo: 'empresa' },
  { emoji: '🧰', texto: 'Cadastre seu serviço', sub: 'Eletricista, pedreiro, diarista...', grupo: 'profissional' },
  { emoji: '🏍️', texto: 'Seja mototaxista ou entregador', sub: 'Ganhe fazendo corridas e entregas', grupo: 'colaborador' },
];

const AJUDA: Opcao[] = [{ emoji: '💬', texto: 'Fale conosco', sub: 'Dúvidas, sugestões e reclamações', grupo: 'contato' }];

function Lista({ opcoes }: { opcoes: Opcao[] }) {
  return (
    <View>
      {opcoes.map((o) => (
        <Pressable
          key={o.texto}
          onPress={() => o.grupo && router.push({ pathname: '/cadastro', params: { grupo: o.grupo } })}
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

        <Pressable onPress={() => router.push('/cadastro')} style={estilos.destaque}>
          <Text style={{ fontSize: 28 }}>🚀</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>Quer aparecer no app?</Text>
            <Text style={{ color: '#D6E4FF', fontSize: 13 }}>Cadastre sua empresa ou serviço. É grátis!</Text>
          </View>
          <Text style={{ color: '#fff', fontSize: 22 }}>›</Text>
        </Pressable>

        <Text style={estilos.secao}>Trabalhe com a gente</Text>
        <Lista opcoes={PARCEIROS} />

        <Text style={estilos.secao}>Ajuda</Text>
        <Lista opcoes={AJUDA} />

        <Text style={estilos.secao}>Minha conta</Text>
        <Lista opcoes={CONTA} />

        <Text style={{ textAlign: 'center', color: cores.textoSuave, fontSize: 12, marginTop: 24 }}>
          {NOME_APP} • versão 0.4 (protótipo)
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
  destaque: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: cores.primaria,
  },
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
