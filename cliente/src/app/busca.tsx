import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { EMPRESAS } from '@/data/empresas';
import { formatarPreco, LOJAS } from '@/data/mock';
import { abrirLoja, BarraSacola, CartaoLoja } from '@/ui/componentes';
import { CartaoEmpresa } from '@/ui/empresa';
import { cores } from '@/ui/theme';

const SUGESTOES = ['Marmitex', 'Pizza', 'Remédio', 'Gás', 'Ração', 'Cimento', 'Celular', 'Mecânico'];

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
  const empresas = termo
    ? EMPRESAS.filter((e) => normalizar(`${e.nome} ${e.ramo} ${e.descricao}`).includes(termo))
    : [];
  const total = lojas.length + itens.length + empresas.length;

  return (
    <View style={{ flex: 1, backgroundColor: cores.fundo }}>
      <View style={estilos.campoCaixa}>
        <Text style={{ fontSize: 16 }}>🔍</Text>
        <TextInput
          value={busca}
          onChangeText={setBusca}
          placeholder="Comida, remédio, empresa, serviço..."
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

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} keyboardShouldPersistTaps="handled">
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

        {termo.length > 0 && total === 0 && (
          <Text style={{ color: cores.textoSuave, textAlign: 'center', marginTop: 40 }}>Nada encontrado para “{busca}”.</Text>
        )}

        {lojas.length > 0 && (
          <View style={{ marginTop: 8 }}>
            <Text style={[estilos.secao, { paddingHorizontal: 16 }]}>Delivery</Text>
            {lojas.map((l) => (
              <CartaoLoja key={l.id} loja={l} />
            ))}
          </View>
        )}

        {itens.length > 0 && (
          <View style={{ marginTop: 8 }}>
            <Text style={[estilos.secao, { paddingHorizontal: 16, marginBottom: 4 }]}>Produtos</Text>
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

        {empresas.length > 0 && (
          <View style={{ marginTop: 8 }}>
            <Text style={[estilos.secao, { paddingHorizontal: 16 }]}>Empresas</Text>
            {empresas.map((e) => (
              <CartaoEmpresa key={e.id} empresa={e} />
            ))}
          </View>
        )}
      </ScrollView>
      <BarraSacola />
    </View>
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
    borderRadius: 12,
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
    borderRadius: 12,
    backgroundColor: cores.fundoSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
