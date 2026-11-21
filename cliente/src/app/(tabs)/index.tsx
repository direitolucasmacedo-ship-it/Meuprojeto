import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BANNERS, CATEGORIAS, LOJAS, type Banner, type Categoria } from '@/data/mock';
import { abrirLoja, BarraSacola, CartaoLoja, TituloSecao } from '@/ui/componentes';
import { CIDADE, cores } from '@/ui/theme';

function abrirCategoria(c: Categoria) {
  if (c.tipo === 'corrida') router.push({ pathname: '/corrida', params: { tipo: c.id } });
  else router.push({ pathname: '/categoria/[id]', params: { id: c.id } });
}

function abrirBanner(b: Banner) {
  const d = b.destino;
  if (d.tipo === 'loja') abrirLoja(d.id);
  else if (d.tipo === 'corrida') router.push({ pathname: '/corrida', params: { tipo: d.id } });
  else router.push({ pathname: '/categoria/[id]', params: { id: d.id } });
}

const FILTROS = [
  { id: 'gratis', nome: 'Entrega grátis' },
  { id: 'avaliados', nome: 'Melhor avaliados' },
  { id: 'perto', nome: 'Mais perto' },
] as const;
type FiltroId = (typeof FILTROS)[number]['id'];

export default function Inicio() {
  const { width } = useWindowDimensions();
  const larguraBanner = Math.min(width, 600) - 48;
  const [filtro, setFiltro] = useState<FiltroId | null>(null);

  let lojas = [...LOJAS];
  if (filtro === 'gratis') lojas = lojas.filter((l) => l.taxaEntrega === 0);
  if (filtro === 'avaliados') lojas.sort((a, b) => b.avaliacao - a.avaliacao);
  if (filtro === 'perto') lojas.sort((a, b) => a.distanciaKm - b.distanciaKm);
  lojas.sort((a, b) => Number(b.aberta) - Number(a.aberta)); // abertas primeiro

  const famosas = LOJAS.filter((l) => l.aberta).sort((a, b) => b.avaliacao - a.avaliacao);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: cores.fundo }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
        {/* Endereço */}
        <View style={estilos.topo}>
          <Text style={estilos.enderecoRotulo}>ENTREGAR EM</Text>
          <Text style={estilos.endereco}>
            {CIDADE} <Text style={{ color: cores.primaria }}>▾</Text>
          </Text>
        </View>

        {/* Busca (leva para a aba Busca) */}
        <Pressable onPress={() => router.navigate('/busca')} style={estilos.busca}>
          <Text style={{ fontSize: 16 }}>🔍</Text>
          <Text style={{ color: cores.textoSuave, fontSize: 15 }}>Buscar item ou loja</Text>
        </Pressable>

        {/* Categorias */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilos.categorias}>
          {CATEGORIAS.map((c) => (
            <Pressable key={c.id} onPress={() => abrirCategoria(c)} style={estilos.categoria}>
              {({ pressed }) => (
                <>
                  <View style={[estilos.categoriaIcone, { backgroundColor: c.cor }, pressed && { opacity: 0.6 }]}>
                    <Text style={{ fontSize: 30 }}>{c.emoji}</Text>
                  </View>
                  <Text style={estilos.categoriaNome}>{c.nome}</Text>
                </>
              )}
            </Pressable>
          ))}
        </ScrollView>

        {/* Banners de promoção */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={larguraBanner + 12}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
          {BANNERS.map((b) => (
            <Pressable
              key={b.id}
              onPress={() => abrirBanner(b)}
              style={[estilos.banner, { width: larguraBanner, backgroundColor: b.cor }]}>
              <View style={{ flex: 1 }}>
                <Text style={estilos.bannerTitulo}>{b.titulo}</Text>
                <Text style={estilos.bannerSub}>{b.subtitulo}</Text>
                <View style={estilos.bannerBotao}>
                  <Text style={{ color: b.cor, fontWeight: '700', fontSize: 12 }}>Aproveitar</Text>
                </View>
              </View>
              <Text style={{ fontSize: 64 }}>{b.emoji}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Famosos */}
        <View style={{ marginTop: 24, gap: 12 }}>
          <TituloSecao>Famosos no Capelinha Delivery</TituloSecao>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}>
            {famosas.map((l) => (
              <Pressable key={l.id} onPress={() => abrirLoja(l.id)} style={{ width: 76, alignItems: 'center', gap: 6 }}>
                <View style={estilos.famosoLogo}>
                  <Text style={{ fontSize: 32 }}>{l.emoji}</Text>
                </View>
                <Text style={estilos.famosoNome} numberOfLines={2}>
                  {l.nome}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Lista de lojas */}
        <View style={{ marginTop: 24, gap: 12 }}>
          <TituloSecao>Lojas</TituloSecao>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
            {FILTROS.map((f) => {
              const ativo = filtro === f.id;
              return (
                <Pressable
                  key={f.id}
                  onPress={() => setFiltro(ativo ? null : f.id)}
                  style={[estilos.chip, ativo && { backgroundColor: cores.primaria, borderColor: cores.primaria }]}>
                  <Text style={[estilos.chipTexto, ativo && { color: '#fff' }]}>{f.nome}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <View>
            {lojas.map((l) => (
              <CartaoLoja key={l.id} loja={l} />
            ))}
            {lojas.length === 0 && (
              <Text style={{ color: cores.textoSuave, paddingHorizontal: 16 }}>Nenhuma loja com esse filtro.</Text>
            )}
          </View>
        </View>
      </ScrollView>
      <BarraSacola acimaDasAbas />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  topo: { alignItems: 'center', paddingTop: 8, paddingBottom: 12 },
  enderecoRotulo: { fontSize: 10, fontWeight: '700', color: cores.textoSuave, letterSpacing: 0.5 },
  endereco: { fontSize: 15, fontWeight: '700', color: cores.textoForte, marginTop: 2 },
  busca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    backgroundColor: cores.fundoSuave,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  categorias: { paddingHorizontal: 12, paddingVertical: 18, gap: 4 },
  categoria: { width: 78, alignItems: 'center', gap: 6 },
  categoriaIcone: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriaNome: { fontSize: 12, color: cores.texto, textAlign: 'center' },
  banner: {
    height: 140,
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bannerTitulo: { color: '#fff', fontSize: 22, fontWeight: '800' },
  bannerSub: { color: '#fff', fontSize: 14, marginTop: 2, opacity: 0.95 },
  bannerBotao: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 12,
  },
  famosoLogo: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: cores.fundoSuave,
    borderWidth: 1,
    borderColor: cores.borda,
    alignItems: 'center',
    justifyContent: 'center',
  },
  famosoNome: { fontSize: 11, color: cores.texto, textAlign: 'center' },
  chip: {
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipTexto: { fontSize: 13, color: cores.texto },
});
