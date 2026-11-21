import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CATEGORIAS, LOJAS, type Categoria } from '@/data/mock';
import { BarraCarrinho, CartaoLoja } from '@/ui/componentes';
import { CIDADE, NOME_APP, cores } from '@/ui/theme';

function abrirCategoria(c: Categoria) {
  if (c.tipo === 'corrida') {
    router.push({ pathname: '/corrida', params: { tipo: c.id } });
  } else {
    router.push({ pathname: '/categoria/[id]', params: { id: c.id } });
  }
}

export default function Inicio() {
  const [busca, setBusca] = useState('');
  const termo = busca.trim().toLowerCase();
  const lojas = termo
    ? LOJAS.filter(
        (l) =>
          l.nome.toLowerCase().includes(termo) ||
          l.produtos.some((p) => p.nome.toLowerCase().includes(termo)),
      )
    : LOJAS.filter((l) => l.aberta);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: cores.fundo }} edges={['top']}>
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <View>
          <Text style={estilos.marca}>{NOME_APP}</Text>
          <Text style={estilos.endereco}>📍 Entregar em {CIDADE}</Text>
        </View>

        <TextInput
          value={busca}
          onChangeText={setBusca}
          placeholder="Buscar lojas, pratos, remédios..."
          placeholderTextColor={cores.textoSuave}
          style={estilos.busca}
        />

        {!termo && (
          <View style={estilos.grade}>
            {CATEGORIAS.map((c) => (
              <Pressable
                key={c.id}
                onPress={() => abrirCategoria(c)}
                style={({ pressed }) => [estilos.categoria, { backgroundColor: c.cor }, pressed && { opacity: 0.7 }]}>
                <Text style={{ fontSize: 28 }}>{c.emoji}</Text>
                <Text style={estilos.categoriaNome}>{c.nome}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <Text style={estilos.secao}>{termo ? 'Resultados' : 'Abertos agora'}</Text>
        {lojas.length === 0 && <Text style={{ color: cores.textoSuave }}>Nada encontrado.</Text>}
        <View style={{ gap: 10 }}>
          {lojas.map((l) => (
            <CartaoLoja key={l.id} loja={l} />
          ))}
        </View>
      </ScrollView>
      <BarraCarrinho />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  conteudo: { padding: 16, gap: 16, paddingBottom: 100 },
  marca: { fontSize: 26, fontWeight: '800', color: cores.primaria },
  endereco: { fontSize: 14, color: cores.textoSuave, marginTop: 2 },
  busca: {
    backgroundColor: cores.cartao,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: cores.texto,
  },
  grade: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 },
  categoria: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  categoriaNome: { fontSize: 11, fontWeight: '600', color: cores.texto },
  secao: { fontSize: 18, fontWeight: '700', color: cores.texto },
});
