import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useApp } from '@/context/app-state';
import { formatarPreco, type Loja } from '@/data/mock';
import { cores } from '@/ui/theme';

export function CartaoLoja({ loja }: { loja: Loja }) {
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/loja/[id]', params: { id: loja.id } })}
      style={({ pressed }) => [estilos.cartaoLoja, pressed && { opacity: 0.7 }, !loja.aberta && { opacity: 0.55 }]}>
      <View style={estilos.logo}>
        <Text style={{ fontSize: 30 }}>{loja.emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={estilos.nomeLoja}>{loja.nome}</Text>
        <Text style={estilos.info}>
          ⭐ {loja.avaliacao.toFixed(1)} · {loja.tempo}
        </Text>
        <Text style={estilos.info}>
          {loja.aberta ? `Entrega ${formatarPreco(loja.taxaEntrega)}` : 'Fechado agora'}
        </Text>
      </View>
    </Pressable>
  );
}

export function BarraCarrinho() {
  const { itens } = useApp();
  if (itens.length === 0) return null;
  const qtd = itens.reduce((s, i) => s + i.quantidade, 0);
  const subtotal = itens.reduce((s, i) => s + i.quantidade * i.produto.preco, 0);
  return (
    <Pressable onPress={() => router.push('/carrinho')} style={estilos.barraCarrinho}>
      <Text style={estilos.barraTexto}>🛍️ {qtd} {qtd === 1 ? 'item' : 'itens'}</Text>
      <Text style={estilos.barraTexto}>Ver carrinho · {formatarPreco(subtotal)}</Text>
    </Pressable>
  );
}

export function Botao({ titulo, onPress, desabilitado }: { titulo: string; onPress: () => void; desabilitado?: boolean }) {
  return (
    <Pressable
      disabled={desabilitado}
      onPress={onPress}
      style={({ pressed }) => [
        estilos.botao,
        pressed && { backgroundColor: cores.primariaEscura },
        desabilitado && { opacity: 0.4 },
      ]}>
      <Text style={estilos.botaoTexto}>{titulo}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  cartaoLoja: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: cores.cartao,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: cores.borda,
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: cores.fundo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nomeLoja: { fontSize: 16, fontWeight: '700', color: cores.texto },
  info: { fontSize: 13, color: cores.textoSuave, marginTop: 2 },
  barraCarrinho: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    backgroundColor: cores.primaria,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barraTexto: { color: '#fff', fontWeight: '700', fontSize: 15 },
  botao: {
    backgroundColor: cores.primaria,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  botaoTexto: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
