import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '@/context/app-state';
import { formatarKm, formatarPreco, type Loja } from '@/data/mock';
import { cores } from '@/ui/theme';

export function abrirLoja(id: string) {
  router.push({ pathname: '/loja/[id]', params: { id } });
}

export function TaxaEntrega({ valor }: { valor: number }) {
  return valor === 0 ? (
    <Text style={[estilos.info, { color: cores.sucesso, fontWeight: '600' }]}>Grátis</Text>
  ) : (
    <Text style={estilos.info}>{formatarPreco(valor)}</Text>
  );
}

// Card de loja em lista (estilo apps de delivery)
export function CartaoLoja({ loja }: { loja: Loja }) {
  return (
    <Pressable
      onPress={() => abrirLoja(loja.id)}
      style={({ pressed }) => [estilos.cartaoLoja, pressed && { backgroundColor: cores.fundoSuave }]}>
      <View style={[estilos.logo, !loja.aberta && { opacity: 0.4 }]}>
        <Text style={{ fontSize: 30 }}>{loja.emoji}</Text>
      </View>
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={[estilos.nomeLoja, !loja.aberta && { color: cores.textoSuave }]} numberOfLines={1}>
          {loja.nome}
        </Text>
        <View style={estilos.linhaInfo}>
          <Text style={[estilos.info, { color: cores.estrela, fontWeight: '700' }]}>★ {loja.avaliacao.toFixed(1)}</Text>
          <Text style={estilos.info}> • {loja.segmento} • {formatarKm(loja.distanciaKm)}</Text>
        </View>
        {loja.aberta ? (
          <View style={estilos.linhaInfo}>
            <Text style={estilos.info}>{loja.tempo} • </Text>
            <TaxaEntrega valor={loja.taxaEntrega} />
          </View>
        ) : (
          <Text style={[estilos.info, { fontWeight: '600' }]}>Fechado agora</Text>
        )}
      </View>
    </Pressable>
  );
}

// Barra fixa "Ver sacola" no rodapé
export function BarraSacola({ acimaDasAbas }: { acimaDasAbas?: boolean }) {
  const { itens } = useApp();
  const insets = useSafeAreaInsets();
  if (itens.length === 0) return null;
  const qtd = itens.reduce((s, i) => s + i.quantidade, 0);
  const subtotal = itens.reduce((s, i) => s + i.quantidade * i.produto.preco, 0);
  return (
    <View style={[estilos.barraFundo, { paddingBottom: acimaDasAbas ? 10 : Math.max(insets.bottom, 12) }]}>
      <Pressable
        onPress={() => router.push('/sacola')}
        style={({ pressed }) => [estilos.barraSacola, pressed && { backgroundColor: cores.primariaEscura }]}>
        <View style={estilos.badge}>
          <Text style={{ color: cores.primaria, fontWeight: '800', fontSize: 13 }}>{qtd}</Text>
        </View>
        <Text style={estilos.barraTexto}>Ver sacola</Text>
        <Text style={estilos.barraTexto}>{formatarPreco(subtotal)}</Text>
      </Pressable>
    </View>
  );
}

export function Botao({
  titulo,
  onPress,
  desabilitado,
  cor = cores.primaria,
}: {
  titulo: string;
  onPress: () => void;
  desabilitado?: boolean;
  cor?: string;
}) {
  return (
    <Pressable
      disabled={desabilitado}
      onPress={onPress}
      style={({ pressed }) => [
        estilos.botao,
        { backgroundColor: cor },
        pressed && { opacity: 0.85 },
        desabilitado && { backgroundColor: '#D6D6D6' },
      ]}>
      <Text style={estilos.botaoTexto}>{titulo}</Text>
    </Pressable>
  );
}

export function TituloSecao({ children }: { children: string }) {
  return <Text style={estilos.titulo}>{children}</Text>;
}

const estilos = StyleSheet.create({
  cartaoLoja: {
    flexDirection: 'row',
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: cores.fundoSuave,
    borderWidth: 1,
    borderColor: cores.borda,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nomeLoja: { fontSize: 16, fontWeight: '600', color: cores.textoForte },
  linhaInfo: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  info: { fontSize: 13, color: cores.textoSuave },
  barraFundo: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: cores.fundo,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
  },
  barraSacola: {
    backgroundColor: cores.primaria,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    backgroundColor: '#fff',
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  barraTexto: { color: '#fff', fontWeight: '700', fontSize: 15 },
  botao: {
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  botaoTexto: { color: '#fff', fontWeight: '700', fontSize: 16 },
  titulo: { fontSize: 18, fontWeight: '700', color: cores.textoForte, paddingHorizontal: 16 },
});
