import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WHATSAPP_CORRIDAS } from '@/config';
import { useApp, type FormaPagamento } from '@/context/app-state';
import { DESTINOS_POPULARES, formatarKm, formatarPreco, TARIFAS, type TipoCorrida } from '@/data/mock';
import { Botao } from '@/ui/componentes';
import { EscolhaPagamento, NOME_PAGAMENTO } from '@/ui/pagamento';
import { NOME_APP, cores } from '@/ui/theme';
import { abrirWhatsApp } from '@/whatsapp';

// PROTÓTIPO: sem mapa ainda, a distância é simulada a partir do texto digitado.
// Na versão real ela virá do GPS + serviço de mapas.
function distanciaSimulada(origem: string, destino: string) {
  const texto = (origem + '|' + destino).toLowerCase();
  let h = 0;
  for (let i = 0; i < texto.length; i++) h = (h * 31 + texto.charCodeAt(i)) % 1000;
  return 1.2 + (h / 1000) * 5; // entre 1,2 km e 6,2 km
}

export default function Corrida() {
  const params = useLocalSearchParams<{ tipo?: string }>();
  const inicial: TipoCorrida = params.tipo && params.tipo in TARIFAS ? (params.tipo as TipoCorrida) : 'moto';
  const { registrarPedido, cliente, setCliente } = useApp();
  const [tipo, setTipo] = useState<TipoCorrida>(inicial);
  const [nome, setNome] = useState(cliente.nome);
  const [origem, setOrigem] = useState(cliente.endereco);
  const [destino, setDestino] = useState('');
  const [detalhe, setDetalhe] = useState('');
  const [pagamento, setPagamento] = useState<FormaPagamento>('dinheiro');
  const insets = useSafeAreaInsets();

  const preenchido = !!(origem.trim() && destino.trim());
  const km = preenchido ? distanciaSimulada(origem, destino) : 0;
  const tarifa = TARIFAS[tipo];
  const preco = tarifa.base + km * tarifa.porKm;
  const ehEntrega = tipo === 'entregas';

  let pendencia = '';
  if (!nome.trim()) pendencia = 'Informe seu nome';
  else if (!preenchido) pendencia = ehEntrega ? 'Informe onde buscar e onde entregar' : 'Informe origem e destino';

  function confirmar() {
    const mensagem = [
      `*${ehEntrega ? 'Pedido de entrega' : 'Pedido de corrida'} — ${NOME_APP}*`,
      `${tarifa.emoji} ${tarifa.nome}`,
      '',
      `🟢 ${ehEntrega ? 'Buscar em' : 'Saída'}: ${origem.trim()}`,
      `🔴 ${ehEntrega ? 'Entregar em' : 'Destino'}: ${destino.trim()}`,
      detalhe.trim() ? `📝 ${detalhe.trim()}` : '',
      '',
      `Valor estimado: ${formatarPreco(preco)} (~${formatarKm(km)})`,
      `Pagamento: ${NOME_PAGAMENTO[pagamento]}`,
      `👤 ${nome.trim()}`,
    ]
      .filter((l, i, arr) => !(l === '' && arr[i - 1] === ''))
      .join('\n');

    setCliente({ nome: nome.trim(), endereco: cliente.endereco || origem.trim() });
    registrarPedido({
      titulo: tarifa.nome,
      emoji: tarifa.emoji,
      descricao: `${origem.trim()} → ${destino.trim()} (~${formatarKm(km)})`,
      total: preco,
      pagamento,
      whatsapp: WHATSAPP_CORRIDAS,
      mensagem,
    });
    router.dismissTo('/pedidos');
    abrirWhatsApp(WHATSAPP_CORRIDAS, mensagem);
  }

  return (
    <View style={{ flex: 1, backgroundColor: cores.fundo }}>
      <Stack.Screen options={{ title: ehEntrega ? 'Enviar algo' : 'Pedir corrida' }} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {(Object.keys(TARIFAS) as TipoCorrida[]).map((t) => {
            const ativo = tipo === t;
            return (
              <Pressable key={t} onPress={() => setTipo(t)} style={[estilos.tipo, ativo && estilos.tipoAtivo]}>
                <Text style={{ fontSize: 28 }}>{TARIFAS[t].emoji}</Text>
                <Text style={[estilos.tipoNome, ativo && { color: cores.primaria }]}>{TARIFAS[t].nome}</Text>
                <Text style={estilos.tipoPreco}>a partir de {formatarPreco(TARIFAS[t].base)}</Text>
              </Pressable>
            );
          })}
        </View>

        {ehEntrega && (
          <Text style={estilos.dica}>
            📦 Um motoboy busca e leva o que você precisar: documentos, chaves, encomendas pequenas.
          </Text>
        )}

        <View style={estilos.rota}>
          <View style={estilos.rotaLinha}>
            <View style={[estilos.ponto, { backgroundColor: cores.sucesso }]} />
            <TextInput
              value={origem}
              onChangeText={setOrigem}
              placeholder={ehEntrega ? 'Onde buscar?' : 'De onde você sai?'}
              placeholderTextColor={cores.textoSuave}
              style={estilos.campoRota}
            />
          </View>
          <View style={estilos.divisor} />
          <View style={estilos.rotaLinha}>
            <View style={[estilos.ponto, { backgroundColor: cores.primaria }]} />
            <TextInput
              value={destino}
              onChangeText={setDestino}
              placeholder={ehEntrega ? 'Onde entregar?' : 'Para onde vai?'}
              placeholderTextColor={cores.textoSuave}
              style={estilos.campoRota}
            />
          </View>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {DESTINOS_POPULARES.map((d) => (
            <Pressable key={d} onPress={() => setDestino(d)} style={[estilos.chip, destino === d && estilos.chipAtivo]}>
              <Text style={{ color: destino === d ? cores.primaria : cores.texto, fontSize: 13 }}>📍 {d}</Text>
            </Pressable>
          ))}
        </View>

        <TextInput
          value={nome}
          onChangeText={setNome}
          placeholder="Seu nome"
          placeholderTextColor={cores.textoSuave}
          style={estilos.campo}
        />
        <TextInput
          value={detalhe}
          onChangeText={setDetalhe}
          placeholder={ehEntrega ? 'O que será entregue?' : 'Observação (ex.: estou com uma mala)'}
          placeholderTextColor={cores.textoSuave}
          style={estilos.campo}
        />

        {preenchido && (
          <View style={estilos.estimativa}>
            <Text style={{ fontSize: 34 }}>{tarifa.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700', fontSize: 16, color: cores.textoForte }}>{tarifa.nome}</Text>
              <Text style={{ color: cores.textoSuave, fontSize: 12 }}>~{formatarKm(km)} (distância simulada)</Text>
            </View>
            <Text style={estilos.preco}>{formatarPreco(preco)}</Text>
          </View>
        )}

        <Text style={estilos.secao}>Pagamento</Text>
        <EscolhaPagamento valor={pagamento} onChange={setPagamento} />
      </ScrollView>

      <View style={[estilos.rodape, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {pendencia ? <Text style={estilos.pendencia}>{pendencia}</Text> : null}
        <Botao
          titulo={`Chamar ${tarifa.nome.toLowerCase()} pelo WhatsApp`}
          desabilitado={!!pendencia}
          onPress={confirmar}
        />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  tipo: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  tipoAtivo: { borderColor: cores.primaria, backgroundColor: cores.primariaClara },
  tipoNome: { fontSize: 13, fontWeight: '700', color: cores.textoForte },
  tipoPreco: { fontSize: 10, color: cores.textoSuave },
  dica: { backgroundColor: cores.fundoSuave, padding: 12, borderRadius: 8, fontSize: 13, color: cores.texto },
  rota: { borderWidth: 1, borderColor: cores.borda, borderRadius: 8, paddingHorizontal: 14 },
  rotaLinha: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ponto: { width: 10, height: 10, borderRadius: 5 },
  divisor: { height: 1, backgroundColor: cores.borda, marginLeft: 22 },
  campoRota: { flex: 1, paddingVertical: 14, fontSize: 15, color: cores.textoForte },
  campo: {
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: cores.textoForte,
  },
  chip: { borderWidth: 1, borderColor: cores.borda, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 },
  chipAtivo: { borderColor: cores.primaria, backgroundColor: cores.primariaClara },
  estimativa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: cores.fundoSuave,
    borderRadius: 8,
    padding: 14,
  },
  preco: { fontSize: 20, fontWeight: '800', color: cores.textoForte },
  secao: { fontSize: 16, fontWeight: '700', color: cores.textoForte, marginTop: 4 },
  rodape: {
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
    backgroundColor: cores.fundo,
    gap: 6,
  },
  pendencia: { textAlign: 'center', color: cores.textoSuave, fontSize: 13 },
});
