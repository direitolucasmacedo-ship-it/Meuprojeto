import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '@/context/app-state';
import { EMPRESAS } from '@/data/empresas';
import { BANNERS, CATEGORIAS, LOJAS, type Banner, type Categoria } from '@/data/mock';
import { MOTOTAXISTAS } from '@/data/mototaxi';
import { abrirLoja, BarraSacola, CartaoLoja, TituloSecao } from '@/ui/componentes';
import { CIDADE, cores } from '@/ui/theme';

function abrirCategoria(c: Categoria) {
  if (c.id === 'moto') router.push('/mototaxi');
  else if (c.tipo === 'corrida') router.push({ pathname: '/corrida', params: { tipo: c.id } });
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

// Serviços da grade (o mototáxi tem destaque próprio no topo)
const SERVICOS = CATEGORIAS.filter((c) => c.id !== 'moto');

export default function Inicio() {
  const { cliente } = useApp();
  const { width } = useWindowDimensions();
  const larguraBanner = Math.min(width, 600) - 64;
  const [filtro, setFiltro] = useState<FiltroId | null>(null);
  const disponiveis = MOTOTAXISTAS.filter((m) => m.disponivel).length;

  let lojas = [...LOJAS];
  if (filtro === 'gratis') lojas = lojas.filter((l) => l.taxaEntrega === 0);
  if (filtro === 'avaliados') lojas.sort((a, b) => b.avaliacao - a.avaliacao);
  if (filtro === 'perto') lojas.sort((a, b) => a.distanciaKm - b.distanciaKm);
  lojas.sort((a, b) => Number(b.aberta) - Number(a.aberta));

  const primeiroNome = cliente.nome.split(' ')[0];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: cores.fundo }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
        {/* Saudação */}
        <View style={estilos.topo}>
          <View style={{ flex: 1 }}>
            <Text style={estilos.ola}>{primeiroNome ? `Olá, ${primeiroNome}! 👋` : 'Olá! 👋'}</Text>
            <Text style={estilos.cidade}>
              📍 {CIDADE} <Text style={{ color: cores.primaria }}>▾</Text>
            </Text>
          </View>
          <View style={estilos.marca}>
            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 15 }}>CD</Text>
          </View>
        </View>

        {/* Busca */}
        <Pressable onPress={() => router.push('/busca')} style={estilos.busca}>
          <Text style={{ fontSize: 16 }}>🔍</Text>
          <Text style={{ color: cores.textoSuave, fontSize: 15 }}>Comida, remédio, empresa, serviço...</Text>
        </Pressable>

        {/* Destaque: mototáxi em 1 toque */}
        <Pressable onPress={() => router.push('/mototaxi')} style={({ pressed }) => [estilos.moto, pressed && { opacity: 0.92 }]}>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={estilos.motoRotulo}>MOTOTÁXI</Text>
            <Text style={estilos.motoTitulo}>Chegue rápido,{'\n'}em 1 toque</Text>
            <Text style={estilos.motoSub}>🟢 {disponiveis} disponíveis agora</Text>
          </View>
          <View style={estilos.motoBotao}>
            <Text style={{ fontSize: 34 }}>🏍️</Text>
            <Text style={estilos.motoBotaoTexto}>CHAMAR</Text>
          </View>
        </Pressable>

        {/* Serviços */}
        <View style={estilos.grade}>
          {SERVICOS.map((c) => (
            <Pressable key={c.id} onPress={() => abrirCategoria(c)} style={estilos.servico}>
              {({ pressed }) => (
                <>
                  <View style={[estilos.servicoIcone, { backgroundColor: c.cor }, pressed && { opacity: 0.6 }]}>
                    <Text style={{ fontSize: 28 }}>{c.emoji}</Text>
                  </View>
                  <Text style={estilos.servicoNome} numberOfLines={1}>
                    {c.nome}
                  </Text>
                </>
              )}
            </Pressable>
          ))}
          <Pressable onPress={() => router.navigate('/empresas')} style={estilos.servico}>
            {({ pressed }) => (
              <>
                <View style={[estilos.servicoIcone, { backgroundColor: cores.primariaClara }, pressed && { opacity: 0.6 }]}>
                  <Text style={{ fontSize: 28 }}>🏢</Text>
                </View>
                <Text style={estilos.servicoNome}>Empresas</Text>
              </>
            )}
          </Pressable>
        </View>

        {/* Banners */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={larguraBanner + 12}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
          {BANNERS.map((b) => (
            <Pressable key={b.id} onPress={() => abrirBanner(b)} style={[estilos.banner, { width: larguraBanner, backgroundColor: b.cor }]}>
              <View style={{ flex: 1 }}>
                <Text style={estilos.bannerTitulo}>{b.titulo}</Text>
                <Text style={estilos.bannerSub}>{b.subtitulo}</Text>
              </View>
              <Text style={{ fontSize: 52 }}>{b.emoji}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Guia de empresas */}
        <View style={{ marginTop: 26, gap: 12 }}>
          <View style={estilos.secaoLinha}>
            <TituloSecao>Empresas de Capelinha</TituloSecao>
            <Pressable onPress={() => router.navigate('/empresas')} hitSlop={8} style={{ paddingRight: 16 }}>
              <Text style={{ color: cores.primaria, fontWeight: '700', fontSize: 13 }}>Ver todas</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}>
            {EMPRESAS.slice(0, 6).map((e) => (
              <Pressable
                key={e.id}
                onPress={() => router.push({ pathname: '/empresa/[id]', params: { id: e.id } })}
                style={estilos.empresa}>
                <Text style={{ fontSize: 28 }}>{e.emoji}</Text>
                <Text style={estilos.empresaNome} numberOfLines={2}>
                  {e.nome}
                </Text>
                <Text style={estilos.empresaRamo} numberOfLines={1}>
                  {e.ramo}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Chamada para cadastro */}
        <Pressable
          onPress={() => router.push('/cadastro')}
          style={({ pressed }) => [estilos.cadastro, pressed && { opacity: 0.9 }]}>
          <Text style={{ fontSize: 26 }}>🚀</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ color: cores.textoForte, fontWeight: '800', fontSize: 15 }}>Sua empresa ou serviço aqui</Text>
            <Text style={{ color: cores.textoSuave, fontSize: 13 }}>Cadastre-se grátis e seja encontrado</Text>
          </View>
          <Text style={{ color: cores.primaria, fontWeight: '800' }}>Cadastrar</Text>
        </Pressable>

        {/* Lojas do delivery */}
        <View style={{ marginTop: 26, gap: 12 }}>
          <TituloSecao>Peça agora</TituloSecao>
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
          </View>
        </View>
      </ScrollView>
      <BarraSacola acimaDasAbas />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  topo: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 14 },
  ola: { fontSize: 22, fontWeight: '800', color: cores.textoForte },
  cidade: { fontSize: 14, color: cores.textoSuave, marginTop: 2 },
  marca: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: cores.primaria,
    alignItems: 'center',
    justifyContent: 'center',
  },
  busca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    backgroundColor: cores.fundoSuave,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  moto: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 18,
    borderRadius: 20,
    backgroundColor: cores.marinho,
    overflow: 'hidden',
  },
  motoRotulo: { color: cores.destaque, fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  motoTitulo: { color: '#fff', fontSize: 21, fontWeight: '800', lineHeight: 26 },
  motoSub: { color: '#C9D6F2', fontSize: 13, marginTop: 4 },
  motoBotao: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: cores.destaque,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: 'rgba(255,198,41,0.35)',
  },
  motoBotaoTexto: { color: cores.marinho, fontWeight: '900', fontSize: 13, letterSpacing: 1 },
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  servico: { width: '23%', alignItems: 'center', gap: 6 },
  servicoIcone: { width: '100%', aspectRatio: 1, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  servicoNome: { fontSize: 12, color: cores.texto, fontWeight: '600' },
  banner: { height: 110, borderRadius: 18, padding: 18, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
  bannerTitulo: { color: '#fff', fontSize: 20, fontWeight: '800' },
  bannerSub: { color: '#fff', fontSize: 14, marginTop: 2, opacity: 0.9 },
  secaoLinha: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  empresa: {
    width: 130,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: cores.borda,
    gap: 4,
  },
  empresaNome: { fontSize: 13, fontWeight: '700', color: cores.textoForte, minHeight: 34 },
  empresaRamo: { fontSize: 11, color: cores.textoSuave },
  cadastro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    borderRadius: 16,
    backgroundColor: cores.primariaClara,
    borderWidth: 1,
    borderColor: '#D3E1FF',
    borderStyle: 'dashed',
  },
  chip: { borderWidth: 1, borderColor: cores.borda, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 7 },
  chipTexto: { fontSize: 13, color: cores.texto, fontWeight: '600' },
});
