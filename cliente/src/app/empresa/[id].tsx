import { Stack, useLocalSearchParams } from 'expo-router';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { WHATSAPP_CENTRAL } from '@/config';
import { EMPRESAS } from '@/data/empresas';
import { abrirLoja } from '@/ui/componentes';
import { mensagemContato, NOME_TIPO } from '@/ui/empresa';
import { cores } from '@/ui/theme';
import { abrirMapa, abrirWhatsApp, formatarTelefone, ligar } from '@/whatsapp';

export default function TelaEmpresa() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const e = EMPRESAS.find((x) => x.id === id);
  if (!e) return <Text style={{ padding: 16 }}>Empresa não encontrada.</Text>;
  const telefone = e.telefone ?? e.whatsapp;
  const temEndereco = !/^Atend/.test(e.endereco);

  return (
    <ScrollView style={{ backgroundColor: cores.fundo }} contentContainerStyle={{ paddingBottom: 32 }}>
      <Stack.Screen options={{ title: NOME_TIPO[e.tipo] }} />

      <View style={estilos.topo}>
        <View style={estilos.logo}>
          <Text style={{ fontSize: 44 }}>{e.emoji}</Text>
        </View>
        <Text style={estilos.nome}>
          {e.nome} {e.verificada && <Text style={{ color: cores.primaria }}>✔︎</Text>}
        </Text>
        <Text style={estilos.ramo}>{e.ramo}</Text>
        <Text style={estilos.descricao}>{e.descricao}</Text>
      </View>

      {/* Ações de contato */}
      <View style={estilos.acoes}>
        {e.whatsapp && (
          <Pressable onPress={() => abrirWhatsApp(e.whatsapp!, mensagemContato(e))} style={[estilos.acao, { backgroundColor: cores.whatsapp }]}>
            <Text style={estilos.acaoEmoji}>💬</Text>
            <Text style={estilos.acaoTexto}>WhatsApp</Text>
          </Pressable>
        )}
        {telefone && (
          <Pressable
            onPress={() => ligar(telefone)}
            style={[estilos.acao, { backgroundColor: e.emergencia ? '#DC2626' : cores.primaria }]}>
            <Text style={estilos.acaoEmoji}>📞</Text>
            <Text style={estilos.acaoTexto}>{e.emergencia ? `Ligar ${telefone}` : 'Ligar'}</Text>
          </Pressable>
        )}
        {temEndereco && (
          <Pressable onPress={() => abrirMapa(e.endereco)} style={[estilos.acao, { backgroundColor: cores.marinho }]}>
            <Text style={estilos.acaoEmoji}>🗺️</Text>
            <Text style={estilos.acaoTexto}>Mapa</Text>
          </Pressable>
        )}
      </View>

      {e.lojaId && (
        <Pressable onPress={() => abrirLoja(e.lojaId!)} style={estilos.delivery}>
          <Text style={{ fontSize: 22 }}>🛍️</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '800', color: cores.primaria }}>Peça pelo delivery</Text>
            <Text style={{ fontSize: 12, color: cores.texto }}>Veja os produtos e monte sua sacola</Text>
          </View>
          <Text style={{ color: cores.primaria, fontSize: 20 }}>›</Text>
        </Pressable>
      )}

      <View style={estilos.infos}>
        <Linha emoji="📍" titulo="Endereço" valor={e.endereco} />
        <Linha emoji="🕒" titulo="Horário" valor={e.horario} />
        {e.whatsapp && <Linha emoji="📱" titulo="WhatsApp" valor={formatarTelefone(e.whatsapp)} />}
        {e.telefone && e.telefone !== e.whatsapp && <Linha emoji="☎️" titulo="Telefone" valor={formatarTelefone(e.telefone)} />}
        {e.instagram && (
          <Pressable onPress={() => Linking.openURL(`https://instagram.com/${e.instagram}`)}>
            <Linha emoji="📸" titulo="Instagram" valor={`@${e.instagram}`} />
          </Pressable>
        )}
        {(e.tipo === 'varejo' || e.tipo === 'atacado') && (
          <Linha emoji="🚚" titulo="Entrega" valor={e.fazEntrega ? 'Faz entrega' : 'Não informado'} />
        )}
      </View>

      <Pressable
        onPress={() => abrirWhatsApp(WHATSAPP_CENTRAL, `Olá! As informações de "${e.nome}" no guia estão desatualizadas: `)}
        style={{ alignSelf: 'center', marginTop: 20 }}>
        <Text style={{ color: cores.textoSuave, fontSize: 12 }}>Informações desatualizadas? Avise a gente.</Text>
      </Pressable>
    </ScrollView>
  );
}

function Linha({ emoji, titulo, valor }: { emoji: string; titulo: string; valor: string }) {
  return (
    <View style={estilos.linha}>
      <Text style={{ fontSize: 18, width: 26 }}>{emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 12, color: cores.textoSuave }}>{titulo}</Text>
        <Text style={{ fontSize: 15, color: cores.textoForte }}>{valor}</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  topo: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 12, gap: 4 },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: cores.primariaClara,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  nome: { fontSize: 22, fontWeight: '800', color: cores.textoForte, textAlign: 'center' },
  ramo: { fontSize: 14, color: cores.primaria, fontWeight: '600' },
  descricao: { fontSize: 14, color: cores.texto, textAlign: 'center', marginTop: 6, lineHeight: 20 },
  acoes: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginTop: 20 },
  acao: { flex: 1, borderRadius: 14, paddingVertical: 14, alignItems: 'center', gap: 2 },
  acaoEmoji: { fontSize: 20 },
  acaoTexto: { color: '#fff', fontWeight: '800', fontSize: 13 },
  delivery: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 14,
    padding: 14,
    borderRadius: 14,
    backgroundColor: cores.primariaClara,
  },
  infos: { marginTop: 20, marginHorizontal: 16, borderWidth: 1, borderColor: cores.borda, borderRadius: 14, paddingHorizontal: 14 },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: cores.borda },
});
