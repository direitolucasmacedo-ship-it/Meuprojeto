import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WHATSAPP_CENTRAL } from '@/config';
import { useApp, type FormaPagamento } from '@/context/app-state';
import { formatarPreco, LOJAS } from '@/data/mock';
import { Botao } from '@/ui/componentes';
import { EscolhaPagamento, NOME_PAGAMENTO } from '@/ui/pagamento';
import { NOME_APP, cores } from '@/ui/theme';
import { abrirWhatsApp } from '@/whatsapp';

export default function Sacola() {
  const { itens, lojaDoCarrinho, adicionar, remover, limparCarrinho, registrarPedido, cliente, setCliente } = useApp();
  const [nome, setNome] = useState(cliente.nome);
  const [endereco, setEndereco] = useState(cliente.endereco);
  const [observacao, setObservacao] = useState('');
  const [pagamento, setPagamento] = useState<FormaPagamento>('pix');
  const insets = useSafeAreaInsets();
  const loja = LOJAS.find((l) => l.id === lojaDoCarrinho);

  if (!loja || itens.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: cores.fundo }}>
        <Text style={{ fontSize: 56 }}>🛍️</Text>
        <Text style={{ fontSize: 17, fontWeight: '700', color: cores.textoForte, marginTop: 12 }}>Sua sacola está vazia</Text>
        <Text style={{ fontSize: 14, color: cores.textoSuave, marginTop: 4 }}>Adicione itens de uma loja para começar.</Text>
      </View>
    );
  }

  const subtotal = itens.reduce((s, i) => s + i.quantidade * i.produto.preco, 0);
  const total = subtotal + loja.taxaEntrega;
  const faltaMinimo = loja.pedidoMinimo - subtotal;

  let pendencia = '';
  if (faltaMinimo > 0) pendencia = `Faltam ${formatarPreco(faltaMinimo)} para o pedido mínimo`;
  else if (!nome.trim()) pendencia = 'Informe seu nome';
  else if (!endereco.trim()) pendencia = 'Informe o endereço de entrega';

  function finalizar() {
    if (!loja) return;
    const linhasItens = itens
      .map((i) => `• ${i.quantidade}x ${i.produto.nome} — ${formatarPreco(i.quantidade * i.produto.preco)}`)
      .join('\n');
    const mensagem = [
      `*Novo pedido — ${NOME_APP}*`,
      `🏪 ${loja.nome}`,
      '',
      linhasItens,
      '',
      `Subtotal: ${formatarPreco(subtotal)}`,
      `Entrega: ${loja.taxaEntrega === 0 ? 'Grátis' : formatarPreco(loja.taxaEntrega)}`,
      `*Total: ${formatarPreco(total)}*`,
      `Pagamento: ${NOME_PAGAMENTO[pagamento]}`,
      '',
      `👤 ${nome.trim()}`,
      `📍 ${endereco.trim()}`,
      observacao.trim() ? `📝 ${observacao.trim()}` : '',
    ]
      .filter((l, i, arr) => !(l === '' && arr[i - 1] === '')) // evita linhas vazias duplicadas
      .join('\n')
      .trim();

    const numero = loja.whatsapp || WHATSAPP_CENTRAL;
    setCliente({ nome: nome.trim(), endereco: endereco.trim() });
    registrarPedido({
      titulo: loja.nome,
      emoji: loja.emoji,
      descricao: itens.map((i) => `${i.quantidade}x ${i.produto.nome}`).join(', '),
      total,
      pagamento,
      whatsapp: numero,
      mensagem,
    });
    limparCarrinho();
    router.dismissTo('/pedidos');
    abrirWhatsApp(numero, mensagem);
  }

  return (
    <View style={{ flex: 1, backgroundColor: cores.fundo }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={estilos.cabecalhoLoja}>
          <Text style={{ fontSize: 28 }}>{loja.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={estilos.lojaNome}>{loja.nome}</Text>
            <Pressable onPress={() => router.back()}>
              <Text style={{ color: cores.primaria, fontWeight: '600', fontSize: 13 }}>Adicionar mais itens</Text>
            </Pressable>
          </View>
        </View>

        <Text style={estilos.secao}>Itens adicionados</Text>
        {itens.map((i) => (
          <View key={i.produto.id} style={estilos.item}>
            <Text style={{ fontSize: 26 }}>{i.produto.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, color: cores.textoForte }}>{i.produto.nome}</Text>
              <Text style={{ fontSize: 14, color: cores.textoForte, marginTop: 2 }}>
                {formatarPreco(i.produto.preco * i.quantidade)}
              </Text>
            </View>
            <View style={estilos.contador}>
              <Pressable onPress={() => remover(i.produto.id)} hitSlop={8} style={estilos.contadorBotao}>
                <Text style={estilos.contadorSinal}>{i.quantidade === 1 ? '🗑' : '−'}</Text>
              </Pressable>
              <Text style={{ fontWeight: '700', minWidth: 18, textAlign: 'center', color: cores.textoForte }}>
                {i.quantidade}
              </Text>
              <Pressable onPress={() => adicionar(loja.id, i.produto)} hitSlop={8} style={estilos.contadorBotao}>
                <Text style={estilos.contadorSinal}>+</Text>
              </Pressable>
            </View>
          </View>
        ))}

        <Text style={estilos.secao}>Entrega</Text>
        <View style={{ paddingHorizontal: 16, gap: 10 }}>
          <TextInput
            value={nome}
            onChangeText={setNome}
            placeholder="Seu nome"
            placeholderTextColor={cores.textoSuave}
            style={estilos.campo}
          />
          <TextInput
            value={endereco}
            onChangeText={setEndereco}
            placeholder="Rua, número, bairro e ponto de referência"
            placeholderTextColor={cores.textoSuave}
            style={[estilos.campo, { minHeight: 64 }]}
            multiline
          />
          <TextInput
            value={observacao}
            onChangeText={setObservacao}
            placeholder="Observação (ex.: sem cebola, troco para R$ 50)"
            placeholderTextColor={cores.textoSuave}
            style={estilos.campo}
          />
        </View>

        <Text style={estilos.secao}>Pagamento</Text>
        <View style={{ paddingHorizontal: 16 }}>
          <EscolhaPagamento valor={pagamento} onChange={setPagamento} />
        </View>

        <Text style={estilos.secao}>Resumo de valores</Text>
        <View style={{ paddingHorizontal: 16, gap: 8 }}>
          <View style={estilos.resumo}>
            <Text style={estilos.resumoRotulo}>Subtotal</Text>
            <Text style={estilos.resumoRotulo}>{formatarPreco(subtotal)}</Text>
          </View>
          <View style={estilos.resumo}>
            <Text style={estilos.resumoRotulo}>Taxa de entrega</Text>
            {loja.taxaEntrega === 0 ? (
              <Text style={{ color: cores.sucesso, fontWeight: '600' }}>Grátis</Text>
            ) : (
              <Text style={estilos.resumoRotulo}>{formatarPreco(loja.taxaEntrega)}</Text>
            )}
          </View>
          <View style={estilos.resumo}>
            <Text style={estilos.total}>Total</Text>
            <Text style={estilos.total}>{formatarPreco(total)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[estilos.rodape, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {pendencia ? <Text style={estilos.pendencia}>{pendencia}</Text> : null}
        <Botao
          titulo={`Fazer pedido pelo WhatsApp • ${formatarPreco(total)}`}
          desabilitado={!!pendencia}
          onPress={finalizar}
        />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  cabecalhoLoja: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  lojaNome: { fontSize: 16, fontWeight: '700', color: cores.textoForte },
  secao: { fontSize: 16, fontWeight: '700', color: cores.textoForte, paddingHorizontal: 16, marginTop: 22, marginBottom: 10 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  contador: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 8,
    paddingHorizontal: 4,
    height: 36,
  },
  contadorBotao: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  contadorSinal: { color: cores.primaria, fontSize: 20, fontWeight: '700' },
  campo: {
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: cores.textoForte,
  },
  resumo: { flexDirection: 'row', justifyContent: 'space-between' },
  resumoRotulo: { color: cores.textoSuave, fontSize: 14 },
  total: { fontWeight: '700', fontSize: 16, color: cores.textoForte },
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
