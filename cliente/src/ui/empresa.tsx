import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Empresa } from '@/data/empresas';
import { NOME_APP, cores } from '@/ui/theme';
import { abrirWhatsApp, ligar } from '@/whatsapp';

export const NOME_TIPO = {
  varejo: 'Varejo',
  atacado: 'Atacado',
  servicos: 'Serviços',
  profissional: 'Profissional',
  publico: 'Utilidade pública',
} as const;

const COR_EMERGENCIA = '#DC2626';

export function mensagemContato(e: Empresa) {
  return `Olá, ${e.nome}! Encontrei vocês pelo ${NOME_APP}.`;
}

export function CartaoEmpresa({ empresa }: { empresa: Empresa }) {
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/empresa/[id]', params: { id: empresa.id } })}
      style={({ pressed }) => [estilos.cartao, pressed && { backgroundColor: cores.fundoSuave }]}>
      <View style={estilos.logo}>
        <Text style={{ fontSize: 28 }}>{empresa.emoji}</Text>
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text style={estilos.nome} numberOfLines={1}>
            {empresa.nome}
          </Text>
          {empresa.verificada && <Text style={{ color: cores.primaria, fontSize: 13 }}>✔︎</Text>}
        </View>
        <Text style={estilos.info} numberOfLines={1}>
          {empresa.ramo}
        </Text>
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
          <Text
            style={[
              estilos.selo,
              empresa.tipo === 'atacado' && estilos.seloAtacado,
              empresa.tipo === 'profissional' && estilos.seloProfissional,
              empresa.tipo === 'publico' && estilos.seloPublico,
            ]}>
            {empresa.emergencia ? 'Emergência • 24h' : NOME_TIPO[empresa.tipo]}
          </Text>
          {empresa.fazEntrega && <Text style={[estilos.selo, estilos.seloEntrega]}>Entrega</Text>}
        </View>
      </View>
      {empresa.whatsapp ? (
        <Pressable
          onPress={(ev) => {
            ev.stopPropagation?.();
            abrirWhatsApp(empresa.whatsapp!, mensagemContato(empresa));
          }}
          hitSlop={8}
          style={estilos.botao}>
          <Text style={estilos.botaoTexto}>WhatsApp</Text>
        </Pressable>
      ) : empresa.telefone ? (
        <Pressable
          onPress={(ev) => {
            ev.stopPropagation?.();
            ligar(empresa.telefone!);
          }}
          hitSlop={8}
          style={[estilos.botao, { backgroundColor: empresa.emergencia ? COR_EMERGENCIA : cores.primaria }]}>
          <Text style={estilos.botaoTexto}>📞 {empresa.emergencia ? empresa.telefone : 'Ligar'}</Text>
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: cores.primariaClara,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nome: { fontSize: 15, fontWeight: '700', color: cores.textoForte, flexShrink: 1 },
  info: { fontSize: 13, color: cores.textoSuave },
  selo: {
    fontSize: 11,
    fontWeight: '700',
    color: cores.primaria,
    backgroundColor: cores.primariaClara,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  seloAtacado: { color: '#7A4B00', backgroundColor: '#FFF3D1' },
  seloEntrega: { color: cores.sucesso, backgroundColor: '#E8F7EE' },
  seloProfissional: { color: '#6D28D9', backgroundColor: '#F1EAFF' },
  seloPublico: { color: '#B91C1C', backgroundColor: '#FDECEC' },
  botao: { backgroundColor: cores.whatsapp, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8 },
  botaoTexto: { color: '#fff', fontWeight: '800', fontSize: 12 },
});
