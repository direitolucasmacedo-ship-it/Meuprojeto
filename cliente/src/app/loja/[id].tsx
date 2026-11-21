import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '@/context/app-state';
import { formatarKm, formatarPreco, LOJAS } from '@/data/mock';
import { BarraSacola, TaxaEntrega } from '@/ui/componentes';
import { cores } from '@/ui/theme';

export default function TelaLoja() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const loja = LOJAS.find((l) => l.id === id);
  const { itens, adicionar, remover, lojaDoCarrinho } = useApp();
  const insets = useSafeAreaInsets();

  if (!loja) return <Text style={{ padding: 16 }}>Loja não encontrada.</Text>;

  const quantidade = (produtoId: string) =>
    lojaDoCarrinho === loja.id ? (itens.find((i) => i.produto.id === produtoId)?.quantidade ?? 0) : 0;

  const promocoes = loja.produtos.filter((p) => p.precoAntigo);

  return (
    <View style={{ flex: 1, backgroundColor: cores.fundo }}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={{ paddingBottom: 110 }}>
        {/* Capa */}
        <View style={[estilos.capa, { backgroundColor: loja.corCapa, paddingTop: insets.top }]}>
          <Text style={estilos.capaEmoji}>{loja.emoji}</Text>
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            style={[estilos.voltar, { top: insets.top + 8 }]}
            hitSlop={10}>
            <Text style={{ fontSize: 20, color: cores.primaria, fontWeight: '700' }}>‹</Text>
          </Pressable>
        </View>

        {/* Logo + informações */}
        <View style={estilos.info}>
          <View style={estilos.logo}>
            <Text style={{ fontSize: 38 }}>{loja.emoji}</Text>
          </View>
          <Text style={estilos.nome}>{loja.nome}</Text>
          <Text style={estilos.detalhe}>
            <Text style={{ color: cores.estrela, fontWeight: '700' }}>★ {loja.avaliacao.toFixed(1)}</Text> • {loja.segmento} •{' '}
            {formatarKm(loja.distanciaKm)}
          </Text>
          {!loja.aberta && <Text style={estilos.fechado}>Loja fechada no momento</Text>}
        </View>

        <View style={estilos.entrega}>
          <View>
            <Text style={estilos.entregaRotulo}>Entrega</Text>
            <Text style={estilos.entregaValor}>{loja.tempo}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={estilos.entregaRotulo}>Taxa</Text>
            <TaxaEntrega valor={loja.taxaEntrega} />
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={estilos.entregaRotulo}>Pedido mínimo</Text>
            <Text style={estilos.entregaValor}>{formatarPreco(loja.pedidoMinimo)}</Text>
          </View>
        </View>

        {lojaDoCarrinho && lojaDoCarrinho !== loja.id && (
          <Text style={estilos.aviso}>
            Sua sacola tem itens de outra loja. Ao adicionar um item daqui, ela será esvaziada.
          </Text>
        )}

        {/* Promoções em destaque */}
        {promocoes.length > 0 && (
          <View style={{ marginTop: 20 }}>
            <Text style={estilos.secao}>Destaques</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
              {promocoes.map((p) => (
                <Pressable
                  key={p.id}
                  disabled={!loja.aberta}
                  onPress={() => adicionar(loja.id, p)}
                  style={estilos.destaque}>
                  <View style={estilos.destaqueFoto}>
                    <Text style={{ fontSize: 44 }}>{p.emoji}</Text>
                  </View>
                  <Text style={estilos.produtoNome} numberOfLines={2}>
                    {p.nome}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 6, alignItems: 'baseline' }}>
                    <Text style={[estilos.preco, { color: cores.sucesso }]}>{formatarPreco(p.preco)}</Text>
                    <Text style={estilos.precoAntigo}>{formatarPreco(p.precoAntigo!)}</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Cardápio */}
        <Text style={[estilos.secao, { marginTop: 20 }]}>Cardápio</Text>
        {loja.produtos.map((p) => {
          const qtd = quantidade(p.id);
          return (
            <View key={p.id} style={estilos.produto}>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={estilos.produtoNome}>{p.nome}</Text>
                <Text style={estilos.descricao} numberOfLines={2}>
                  {p.descricao}
                </Text>
                <View style={{ flexDirection: 'row', gap: 6, alignItems: 'baseline', marginTop: 2 }}>
                  <Text style={[estilos.preco, !!p.precoAntigo && { color: cores.sucesso }]}>{formatarPreco(p.preco)}</Text>
                  {p.precoAntigo && <Text style={estilos.precoAntigo}>{formatarPreco(p.precoAntigo)}</Text>}
                </View>
              </View>
              <View>
                <View style={estilos.produtoFoto}>
                  <Text style={{ fontSize: 38 }}>{p.emoji}</Text>
                </View>
                {loja.aberta && (
                  <View style={estilos.contador}>
                    {qtd > 0 && (
                      <>
                        <Pressable onPress={() => remover(p.id)} hitSlop={8} style={estilos.contadorBotao}>
                          <Text style={estilos.contadorSinal}>−</Text>
                        </Pressable>
                        <Text style={estilos.qtd}>{qtd}</Text>
                      </>
                    )}
                    <Pressable onPress={() => adicionar(loja.id, p)} hitSlop={8} style={estilos.contadorBotao}>
                      <Text style={estilos.contadorSinal}>+</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
      <BarraSacola />
    </View>
  );
}

const estilos = StyleSheet.create({
  capa: { height: 150, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  capaEmoji: { fontSize: 110, opacity: 0.25 },
  voltar: {
    position: 'absolute',
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { alignItems: 'center', marginTop: -40, paddingHorizontal: 16, gap: 4 },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: cores.borda,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  nome: { fontSize: 20, fontWeight: '700', color: cores.textoForte, textAlign: 'center' },
  detalhe: { fontSize: 13, color: cores.textoSuave },
  fechado: { color: cores.primaria, fontWeight: '700', marginTop: 4 },
  entrega: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 8,
  },
  entregaRotulo: { fontSize: 11, color: cores.textoSuave },
  entregaValor: { fontSize: 13, color: cores.textoForte, fontWeight: '600' },
  aviso: {
    backgroundColor: '#FFF4CC',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    color: cores.texto,
    fontSize: 13,
  },
  secao: { fontSize: 17, fontWeight: '700', color: cores.textoForte, paddingHorizontal: 16, marginBottom: 10 },
  destaque: { width: 140, gap: 4 },
  destaqueFoto: {
    width: 140,
    height: 110,
    borderRadius: 8,
    backgroundColor: cores.fundoSuave,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  produto: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  produtoNome: { fontSize: 15, fontWeight: '500', color: cores.textoForte },
  descricao: { fontSize: 13, color: cores.textoSuave, lineHeight: 18 },
  preco: { fontSize: 15, color: cores.textoForte },
  precoAntigo: { fontSize: 12, color: cores.textoSuave, textDecorationLine: 'line-through' },
  produtoFoto: {
    width: 96,
    height: 96,
    borderRadius: 8,
    backgroundColor: cores.fundoSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contador: {
    position: 'absolute',
    right: 4,
    bottom: -10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: cores.borda,
    paddingHorizontal: 4,
    height: 34,
  },
  contadorBotao: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  contadorSinal: { color: cores.primaria, fontSize: 22, fontWeight: '700', lineHeight: 24 },
  qtd: { fontSize: 14, fontWeight: '700', minWidth: 16, textAlign: 'center', color: cores.textoForte },
});
