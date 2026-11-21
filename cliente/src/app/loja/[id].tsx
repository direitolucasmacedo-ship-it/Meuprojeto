import { Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useApp } from '@/context/app-state';
import { formatarPreco, LOJAS } from '@/data/mock';
import { BarraCarrinho } from '@/ui/componentes';
import { cores } from '@/ui/theme';

export default function TelaLoja() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const loja = LOJAS.find((l) => l.id === id);
  const { itens, adicionar, remover, lojaDoCarrinho } = useApp();

  if (!loja) return <Text style={{ padding: 16 }}>Loja não encontrada.</Text>;

  const quantidade = (produtoId: string) =>
    lojaDoCarrinho === loja.id ? (itens.find((i) => i.produto.id === produtoId)?.quantidade ?? 0) : 0;

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: loja.nome }} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 100 }}>
        <View style={estilos.cabecalho}>
          <Text style={{ fontSize: 48 }}>{loja.emoji}</Text>
          <Text style={estilos.nome}>{loja.nome}</Text>
          <Text style={estilos.info}>
            ⭐ {loja.avaliacao.toFixed(1)} · {loja.tempo} · Entrega {formatarPreco(loja.taxaEntrega)}
          </Text>
          {!loja.aberta && <Text style={estilos.fechado}>Fechado agora — volte mais tarde</Text>}
        </View>

        {lojaDoCarrinho && lojaDoCarrinho !== loja.id && (
          <Text style={estilos.aviso}>
            Seu carrinho tem itens de outra loja. Ao adicionar um item daqui, ele será substituído.
          </Text>
        )}

        {loja.produtos.map((p) => {
          const qtd = quantidade(p.id);
          return (
            <View key={p.id} style={estilos.produto}>
              <View style={{ flex: 1 }}>
                <Text style={estilos.produtoNome}>{p.nome}</Text>
                <Text style={estilos.info}>{p.descricao}</Text>
                <Text style={estilos.preco}>{formatarPreco(p.preco)}</Text>
              </View>
              {loja.aberta && (
                <View style={estilos.contador}>
                  {qtd > 0 && (
                    <>
                      <Pressable onPress={() => remover(p.id)} style={estilos.botaoQtd} hitSlop={8}>
                        <Text style={estilos.botaoQtdTexto}>−</Text>
                      </Pressable>
                      <Text style={estilos.qtd}>{qtd}</Text>
                    </>
                  )}
                  <Pressable onPress={() => adicionar(loja.id, p)} style={estilos.botaoQtd} hitSlop={8}>
                    <Text style={estilos.botaoQtdTexto}>+</Text>
                  </Pressable>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
      <BarraCarrinho />
    </View>
  );
}

const estilos = StyleSheet.create({
  cabecalho: { alignItems: 'center', gap: 4, paddingVertical: 8 },
  nome: { fontSize: 22, fontWeight: '800', color: cores.texto, textAlign: 'center' },
  info: { fontSize: 13, color: cores.textoSuave, marginTop: 2 },
  fechado: { color: cores.primaria, fontWeight: '700', marginTop: 6 },
  aviso: { backgroundColor: '#FFF4CC', padding: 10, borderRadius: 10, color: cores.texto, fontSize: 13 },
  produto: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: cores.cartao,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  produtoNome: { fontSize: 15, fontWeight: '700', color: cores.texto },
  preco: { fontSize: 15, fontWeight: '700', color: cores.sucesso, marginTop: 6 },
  contador: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  botaoQtd: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: cores.primaria,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoQtdTexto: { color: '#fff', fontSize: 20, fontWeight: '700', lineHeight: 22 },
  qtd: { fontSize: 16, fontWeight: '700', minWidth: 16, textAlign: 'center', color: cores.texto },
});
