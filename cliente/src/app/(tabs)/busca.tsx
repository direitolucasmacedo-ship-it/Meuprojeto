import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatarPreco, LOJAS } from '@/data/mock';
import { abrirLoja, BarraSacola, CartaoLoja } from '@/ui/componentes';
import { cores } from '@/ui/theme';

const SUGESTOES = ['Marmitex', 'Pizza', 'Hambúrguer', 'Remédio', 'Gás', 'Ração', 'Pão de queijo'];

function normalizar(t: string) {
  return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export default function Busca() {
  const [busca, setBusca] = useState('');
  const termo = normalizar(busca.trim());

  const lojas = termo ? LOJAS.filter((l) => normalizar(l.nome + ' ' + l.segmento).includes(termo)) : [];
  const itens = termo
    ? LOJAS.flatMap((l) =>
        l.produtos.filter((p) => normalizar(p.nome + ' ' + p.descricao).includes(termo)).map((p) => ({ loja: l, produto: p })),
      )
    : [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: cores.fundo }} edges={['top']}>
      <View style={estilos.campoCaixa}>
        <Text style={{ fontSize: 16 }}>🔍</Text>
        <TextInput
          value={busca}
          onChangeText={setBusca}
          placeholder="Buscar item ou loja"
          placeholderTextColor={cores.textoSuave}
          style={estilos.campo}
          autoFocus
          returnKeyType="search"
        />
        {busca.length > 0 && (
          <Pressable onPress={() => setBusca('')} hitSlop={10}>
            <Text style={{ color: cores.textoSuave, fontSize: 16 }}>✕</Text>
          </Pressable>
        )}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 90 }} keyboardShouldPersistTaps="handled">
        {!termo && (
          <View style={{ padding: 16, gap: 12 }}>
            <Text style={estilos.secao}>Buscas populares</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {SUGESTOES.map((s) => (
                <Pressable key={s} onPress={() => setBusca(s)} style={estilos.chip}>
                  <Text style={{ color: cores.texto, fontSize: 13 }}>{s}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {termo.length > 0 && lojas.length + itens.length === 0 && (
          <Text style={{ color: cores.textoSuave, textAlign: 'center', marginTop: 40 }}>
            Nada encontrado para “{busca}”.
          </Text>
        )}

        {lojas.length > 0 && (
          <View style={{ marginTop: 8 }}>
            <Text style={[estilos.secao, { paddingHorizontal: 16 }]}>Lojas</Text>
            {lojas.map((l) => (
              <CartaoLoja key={l.id} loja={l} />
            ))}
          </View>
        )}

        {itens.length > 0 && (
          <View style={{ marginTop: 8 }}>
            <Text style={[estilos.secao, { paddingHorizontal: 16, marginBottom: 4 }]}>Itens</Text>
            {itens.map(({ loja, produto }) => (
              <Pressable
                key={loja.id + produto.id}
                onPress={() => abrirLoja(loja.id)}
                style={({ pressed }) => [estilos.item, pressed && { backgroundColor: cores.fundoSuave }]}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, color: cores.textoForte, fontWeight: '500' }}>{produto.nome}</Text>
                  <Text style={{ fontSize: 12, color: cores.textoSuave, marginTop: 2 }}>{loja.nome}</Text>
                  <Text style={{ fontSize: 14, color: cores.textoForte, marginTop: 4 }}>{formatarPreco(produto.preco)}</Text>
                </View>
                <View style={estilos.itemFoto}>
                  <Text style={{ fontSize: 30 }}>{produto.emoji}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
      <BarraSacola acimaDasAbas />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  campoCaixa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    margin: 16,
    marginBottom: 4,
    backgroundColor: cores.fundoSuave,
    borderRadius: 8,
    paddingHorizontal: 14,
  },
  campo: { flex: 1, paddingVertical: 12, fontSize: 15, color: cores.textoForte },
  secao: { fontSize: 16, fontWeight: '700', color: cores.textoForte },
  chip: { borderWidth: 1, borderColor: cores.borda, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 7 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  itemFoto: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: cores.fundoSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
