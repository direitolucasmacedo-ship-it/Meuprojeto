import * as Location from 'expo-location';
import { router, Stack } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '@/context/app-state';
import { formatarKm, formatarPreco, TARIFAS } from '@/data/mock';
import { buscarMaisProximo, MOTOTAXISTAS, type Mototaxista } from '@/data/mototaxi';
import { NOME_APP, cores } from '@/ui/theme';
import { abrirWhatsApp, ligar } from '@/whatsapp';

type Fase = 'pronto' | 'buscando' | 'encontrado' | 'ninguem';
type Achado = { mototaxista: Mototaxista; minutos: number; distanciaKm: number };

const nativo = Platform.OS !== 'web';

function formatarTempo(seg: number) {
  return `${Math.floor(seg / 60)}:${String(seg % 60).padStart(2, '0')}`;
}

export default function Mototaxi() {
  const { cliente, setCliente, registrarPedido } = useApp();
  const insets = useSafeAreaInsets();
  const [fase, setFase] = useState<Fase>('pronto');
  const [origem, setOrigem] = useState(cliente.endereco);
  const [destino, setDestino] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [pegandoGps, setPegandoGps] = useState(false);
  const [erroGps, setErroGps] = useState('');
  const [segundos, setSegundos] = useState(0);
  const [achado, setAchado] = useState<Achado | null>(null);

  const giro = useRef(new Animated.Value(0)).current;
  const pulso = useRef(new Animated.Value(0)).current;

  const disponiveis = MOTOTAXISTAS.filter((m) => m.disponivel).length;
  const temOrigem = !!(coords || origem.trim());

  // Animações: pulso sempre; giro só enquanto busca
  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(pulso, { toValue: 1, duration: 1600, easing: Easing.out(Easing.ease), useNativeDriver: nativo }),
    );
    anim.start();
    return () => anim.stop();
  }, [pulso]);

  useEffect(() => {
    if (fase !== 'buscando') return;
    giro.setValue(0);
    const anim = Animated.loop(
      Animated.timing(giro, { toValue: 1, duration: 1100, easing: Easing.linear, useNativeDriver: nativo }),
    );
    anim.start();

    // cronômetro
    setSegundos(0);
    const relogio = setInterval(() => setSegundos((s) => s + 1), 1000);

    // SIMULAÇÃO da busca (na versão real, o servidor responde quando um mototaxista aceita)
    const duracao = 4000 + Math.random() * 3000;
    const busca = setTimeout(() => {
      const resultado = buscarMaisProximo();
      if (!resultado) {
        setFase('ninguem');
        return;
      }
      setAchado(resultado);
      setFase('encontrado');
    }, duracao);

    return () => {
      anim.stop();
      clearInterval(relogio);
      clearTimeout(busca);
    };
  }, [fase, giro]);

  // Retorna true se conseguiu a localização
  async function usarLocalizacao(): Promise<boolean> {
    setPegandoGps(true);
    setErroGps('');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') throw new Error('sem permissão');
      const pos = await Location.getCurrentPositionAsync({});
      setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      setOrigem('');
      return true;
    } catch {
      setErroGps('Não conseguimos sua localização. Digite onde você está.');
      return false;
    } finally {
      setPegandoGps(false);
    }
  }

  // Um toque: se o cliente não informou onde está, pega a localização e já chama
  async function chamar() {
    if (!temOrigem && !(await usarLocalizacao())) return;
    if (origem.trim()) setCliente({ ...cliente, endereco: cliente.endereco || origem.trim() });
    setAchado(null);
    setFase('buscando');
  }

  function mensagemPara(m: Mototaxista) {
    return [
      `*Corrida de mototáxi — ${NOME_APP}*`,
      `Olá, ${m.nome}! Preciso de uma corrida.`,
      '',
      coords
        ? `🟢 Estou aqui: https://maps.google.com/?q=${coords.lat.toFixed(6)},${coords.lng.toFixed(6)}`
        : `🟢 Estou em: ${origem.trim()}`,
      destino.trim() ? `🔴 Vou para: ${destino.trim()}` : '',
      cliente.nome ? `👤 ${cliente.nome}` : '',
    ]
      .filter(Boolean)
      .join('\n');
  }

  function confirmarWhatsApp() {
    if (!achado) return;
    const m = achado.mototaxista;
    const mensagem = mensagemPara(m);
    registrarPedido({
      titulo: `Mototáxi • ${m.nome}`,
      emoji: '🏍️',
      descricao: `${coords ? 'Minha localização' : origem.trim()}${destino.trim() ? ` → ${destino.trim()}` : ''} • ${m.moto} ${m.placa}`,
      total: TARIFAS.moto.base + achado.distanciaKm * TARIFAS.moto.porKm,
      pagamento: 'dinheiro',
      whatsapp: m.whatsapp,
      mensagem,
    });
    abrirWhatsApp(m.whatsapp, mensagem);
  }

  const escala = pulso.interpolate({ inputRange: [0, 1], outputRange: [1, 1.6] });
  const opacidade = pulso.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0] });
  const rotacao = giro.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={{ flex: 1, backgroundColor: cores.marinho }}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24, flexGrow: 1 }}
        keyboardShouldPersistTaps="handled">
        {/* Topo */}
        <View style={estilos.topo}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={estilos.voltar}>
            <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700' }}>‹</Text>
          </Pressable>
          <Text style={estilos.topoTitulo}>Mototáxi</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Onde estou / para onde */}
        {(fase === 'pronto' || fase === 'ninguem') && (
          <View style={estilos.rota}>
            <View style={estilos.rotaLinha}>
              <View style={[estilos.ponto, { backgroundColor: cores.sucesso }]} />
              {coords ? (
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: 14 }}>
                  <Text style={{ flex: 1, color: cores.textoForte, fontSize: 15, fontWeight: '600' }}>📍 Minha localização atual</Text>
                  <Pressable onPress={() => setCoords(null)} hitSlop={8}>
                    <Text style={{ color: cores.textoSuave }}>✕</Text>
                  </Pressable>
                </View>
              ) : (
                <TextInput
                  value={origem}
                  onChangeText={setOrigem}
                  placeholder="Onde você está?"
                  placeholderTextColor={cores.textoSuave}
                  style={estilos.campo}
                />
              )}
            </View>
            <View style={estilos.divisor} />
            <View style={estilos.rotaLinha}>
              <View style={[estilos.ponto, { backgroundColor: cores.primaria }]} />
              <TextInput
                value={destino}
                onChangeText={setDestino}
                placeholder="Para onde? (opcional)"
                placeholderTextColor={cores.textoSuave}
                style={estilos.campo}
              />
            </View>
            {!coords && (
              <Pressable onPress={usarLocalizacao} style={estilos.gps} disabled={pegandoGps}>
                <Text style={{ color: cores.primaria, fontWeight: '700', fontSize: 13 }}>
                  {pegandoGps ? 'Pegando sua localização…' : '◎ Usar minha localização'}
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Área central: botão / busca / resultado */}
        <View style={estilos.centro}>
          {(fase === 'pronto' || fase === 'buscando' || fase === 'ninguem') && (
            <>
              <View style={estilos.botaoArea}>
                <Animated.View style={[estilos.onda, { transform: [{ scale: escala }], opacity: opacidade }]} />
                {fase === 'buscando' && (
                  <Animated.View style={[estilos.anelGiro, { transform: [{ rotate: rotacao }] }]} />
                )}
                <Pressable
                  onPress={fase === 'buscando' || pegandoGps ? undefined : chamar}
                  style={({ pressed }) => [estilos.botaoGrande, pressed && { transform: [{ scale: 0.96 }] }]}>
                  <Text style={{ fontSize: 54 }}>🏍️</Text>
                  <Text style={estilos.botaoGrandeTexto}>
                    {fase === 'buscando' ? formatarTempo(segundos) : 'CHAMAR'}
                  </Text>
                </Pressable>
              </View>

              {fase === 'pronto' && (
                <>
                  <Text style={estilos.titulo}>{pegandoGps ? 'Pegando sua localização…' : 'Toque para chamar'}</Text>
                  {!!erroGps && <Text style={[estilos.subtitulo, { color: cores.destaque }]}>{erroGps}</Text>}
                  <Text style={estilos.subtitulo}>
                    🟢 {disponiveis} mototaxistas disponíveis agora • a partir de {formatarPreco(TARIFAS.moto.base)}
                  </Text>
                </>
              )}
              {fase === 'buscando' && (
                <>
                  <Text style={estilos.titulo}>Procurando o mototaxista mais próximo…</Text>
                  <Text style={estilos.subtitulo}>Aguarde, isso leva só alguns segundos</Text>
                  <Pressable onPress={() => setFase('pronto')} style={estilos.cancelar}>
                    <Text style={{ color: '#fff', fontWeight: '700' }}>Cancelar</Text>
                  </Pressable>
                </>
              )}
              {fase === 'ninguem' && (
                <>
                  <Text style={estilos.titulo}>Nenhum mototaxista livre agora</Text>
                  <Text style={estilos.subtitulo}>Tente de novo em instantes</Text>
                </>
              )}
            </>
          )}

          {fase === 'encontrado' && achado && (
            <View style={{ width: '100%', paddingHorizontal: 16, gap: 14 }}>
              <View style={{ alignItems: 'center', gap: 4 }}>
                <Text style={{ fontSize: 40 }}>✅</Text>
                <Text style={estilos.titulo}>Mototaxista encontrado!</Text>
                <Text style={estilos.subtitulo}>
                  Chega em ~{achado.minutos} min • {formatarKm(achado.distanciaKm)} de você
                </Text>
              </View>

              <View style={estilos.cartao}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <View style={estilos.avatar}>
                    <Text style={{ fontSize: 34 }}>🧑</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 20, fontWeight: '800', color: cores.textoForte }}>{achado.mototaxista.nome}</Text>
                    <Text style={{ color: cores.textoSuave, fontSize: 13 }}>
                      <Text style={{ color: cores.estrela, fontWeight: '700' }}>★ {achado.mototaxista.avaliacao.toFixed(1)}</Text> •{' '}
                      {achado.mototaxista.corridas} corridas
                    </Text>
                  </View>
                  <View style={estilos.placa}>
                    <Text style={estilos.placaTexto}>{achado.mototaxista.placa}</Text>
                  </View>
                </View>
                <View style={estilos.motoInfo}>
                  <Text style={{ fontSize: 22 }}>🏍️</Text>
                  <Text style={{ color: cores.texto, fontSize: 14 }}>
                    {achado.mototaxista.moto} • {achado.mototaxista.cor}
                  </Text>
                </View>

                <Pressable onPress={confirmarWhatsApp} style={[estilos.acao, { backgroundColor: cores.whatsapp }]}>
                  <Text style={estilos.acaoTexto}>Confirmar pelo WhatsApp</Text>
                </Pressable>
                <Pressable onPress={() => ligar(achado.mototaxista.whatsapp)} style={[estilos.acao, estilos.acaoContorno]}>
                  <Text style={[estilos.acaoTexto, { color: cores.primaria }]}>📞 Ligar para {achado.mototaxista.nome}</Text>
                </Pressable>
              </View>

              <Pressable onPress={() => setFase('pronto')} style={{ alignSelf: 'center', padding: 8 }}>
                <Text style={{ color: '#C9D6F2', fontWeight: '600' }}>Cancelar corrida</Text>
              </Pressable>
            </View>
          )}
        </View>

        <Text style={estilos.aviso}>
          Protótipo: a escolha do mototaxista é simulada. Na versão final, o app usa o GPS dos mototaxistas.
        </Text>
      </ScrollView>
    </View>
  );
}

const TAM = 190;

const estilos = StyleSheet.create({
  topo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, marginBottom: 12 },
  voltar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topoTitulo: { color: '#fff', fontSize: 17, fontWeight: '700' },
  rota: { backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 16, paddingHorizontal: 14 },
  rotaLinha: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ponto: { width: 10, height: 10, borderRadius: 5 },
  divisor: { height: 1, backgroundColor: cores.borda, marginLeft: 22 },
  campo: { flex: 1, paddingVertical: 14, fontSize: 15, color: cores.textoForte },
  gps: { borderTopWidth: 1, borderTopColor: cores.borda, paddingVertical: 12, alignItems: 'center' },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 28, gap: 8 },
  botaoArea: { width: TAM * 1.7, height: TAM * 1.7, alignItems: 'center', justifyContent: 'center' },
  onda: {
    position: 'absolute',
    width: TAM,
    height: TAM,
    borderRadius: TAM / 2,
    backgroundColor: cores.destaque,
  },
  anelGiro: {
    position: 'absolute',
    width: TAM + 26,
    height: TAM + 26,
    borderRadius: (TAM + 26) / 2,
    borderWidth: 5,
    borderColor: 'rgba(255,255,255,0.15)',
    borderTopColor: '#fff',
    borderRightColor: '#fff',
  },
  botaoGrande: {
    width: TAM,
    height: TAM,
    borderRadius: TAM / 2,
    backgroundColor: cores.destaque,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  botaoGrandeTexto: { fontSize: 22, fontWeight: '900', color: cores.marinho, letterSpacing: 1.5, marginTop: 2 },
  titulo: { color: '#fff', fontSize: 20, fontWeight: '800', textAlign: 'center', paddingHorizontal: 24 },
  subtitulo: { color: '#C9D6F2', fontSize: 14, textAlign: 'center', paddingHorizontal: 24 },
  cancelar: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  cartao: { backgroundColor: '#fff', borderRadius: 18, padding: 16, gap: 12 },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: cores.primariaClara,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placa: { borderWidth: 2, borderColor: cores.textoForte, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  placaTexto: { fontWeight: '800', fontSize: 13, letterSpacing: 1, color: cores.textoForte },
  motoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: cores.fundoSuave,
    borderRadius: 10,
    padding: 10,
  },
  acao: { borderRadius: 12, paddingVertical: 15, alignItems: 'center' },
  acaoContorno: { borderWidth: 1.5, borderColor: cores.primaria },
  acaoTexto: { color: '#fff', fontWeight: '800', fontSize: 15 },
  aviso: { color: '#8FA3CC', fontSize: 11, textAlign: 'center', paddingHorizontal: 32, marginTop: 8 },
});
