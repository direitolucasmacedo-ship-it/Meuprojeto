import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { useApp, type FormaPagamento } from '@/context/app-state';
import { DESTINOS_POPULARES, formatarPreco, TARIFAS, type TipoCorrida } from '@/data/mock';
import { Botao } from '@/ui/componentes';
import { EscolhaPagamento } from '@/ui/pagamento';
import { cores } from '@/ui/theme';

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
  const [tipo, setTipo] = useState<TipoCorrida>(inicial);
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [pagamento, setPagamento] = useState<FormaPagamento>('dinheiro');
  const { registrarPedido } = useApp();

  const pronto = origem.trim() && destino.trim();
  const km = pronto ? distanciaSimulada(origem, destino) : 0;
  const tarifa = TARIFAS[tipo];
  const preco = tarifa.base + km * tarifa.porKm;

  function confirmar() {
    registrarPedido({
      titulo: tarifa.nome,
      emoji: tarifa.emoji,
      descricao: `${origem.trim()} → ${destino.trim()} (~${km.toFixed(1).replace('.', ',')} km)`,
      total: preco,
      pagamento,
    });
    router.dismissTo('/pedidos');
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
      <Stack.Screen options={{ title: tipo === 'entregas' ? 'Enviar algo' : 'Pedir corrida' }} />

      <View style={{ flexDirection: 'row', gap: 8 }}>
        {(Object.keys(TARIFAS) as TipoCorrida[]).map((t) => (
          <Pressable key={t} onPress={() => setTipo(t)} style={[estilos.tipo, tipo === t && estilos.tipoAtivo]}>
            <Text style={{ fontSize: 26 }}>{TARIFAS[t].emoji}</Text>
            <Text style={estilos.tipoNome}>{TARIFAS[t].nome}</Text>
          </Pressable>
        ))}
      </View>

      {tipo === 'entregas' && (
        <Text style={estilos.dica}>
          Um motoboy busca e leva o que você precisar: documentos, chaves, encomendas pequenas.
        </Text>
      )}

      <TextInput
        value={origem}
        onChangeText={setOrigem}
        placeholder="🟢 De onde? (rua, número, bairro)"
        placeholderTextColor={cores.textoSuave}
        style={estilos.campo}
      />
      <TextInput
        value={destino}
        onChangeText={setDestino}
        placeholder="🔴 Para onde?"
        placeholderTextColor={cores.textoSuave}
        style={estilos.campo}
      />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {DESTINOS_POPULARES.map((d) => (
          <Pressable key={d} onPress={() => setDestino(d)} style={estilos.chip}>
            <Text style={{ color: cores.texto, fontSize: 13 }}>{d}</Text>
          </Pressable>
        ))}
      </View>

      {pronto && (
        <View style={estilos.estimativa}>
          <Text style={{ color: cores.textoSuave }}>Preço estimado (distância simulada no protótipo)</Text>
          <Text style={estilos.preco}>{formatarPreco(preco)}</Text>
          <Text style={{ color: cores.textoSuave }}>~{km.toFixed(1).replace('.', ',')} km</Text>
        </View>
      )}

      <Text style={estilos.secao}>Pagamento</Text>
      <EscolhaPagamento valor={pagamento} onChange={setPagamento} />

      <Botao
        titulo={pronto ? `Chamar ${tarifa.nome.toLowerCase()}` : 'Preencha origem e destino'}
        desabilitado={!pronto}
        onPress={confirmar}
      />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  tipo: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: cores.cartao,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  tipoAtivo: { borderColor: cores.primaria, borderWidth: 2 },
  tipoNome: { fontSize: 12, fontWeight: '600', color: cores.texto },
  dica: { backgroundColor: '#FCE4EC', padding: 10, borderRadius: 10, fontSize: 13, color: cores.texto },
  campo: {
    backgroundColor: cores.cartao,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: cores.texto,
  },
  chip: {
    backgroundColor: cores.cartao,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  estimativa: {
    backgroundColor: cores.cartao,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  preco: { fontSize: 28, fontWeight: '800', color: cores.sucesso },
  secao: { fontSize: 16, fontWeight: '700', color: cores.texto },
});
