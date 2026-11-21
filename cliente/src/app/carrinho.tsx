import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { useApp, type FormaPagamento } from '@/context/app-state';
import { formatarPreco, LOJAS } from '@/data/mock';
import { Botao } from '@/ui/componentes';
import { EscolhaPagamento } from '@/ui/pagamento';
import { cores } from '@/ui/theme';

export default function Carrinho() {
  const { itens, lojaDoCarrinho, adicionar, remover, limparCarrinho, registrarPedido } = useApp();
  const [endereco, setEndereco] = useState('');
  const [observacao, setObservacao] = useState('');
  const [pagamento, setPagamento] = useState<FormaPagamento>('pix');
  const loja = LOJAS.find((l) => l.id === lojaDoCarrinho);

  if (!loja || itens.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 48 }}>🛍️</Text>
        <Text style={{ fontSize: 16, color: cores.textoSuave, marginTop: 8 }}>Seu carrinho está vazio.</Text>
      </View>
    );
  }

  const subtotal = itens.reduce((s, i) => s + i.quantidade * i.produto.preco, 0);
  const total = subtotal + loja.taxaEntrega;

  function finalizar() {
    if (!loja) return;
    registrarPedido({
      titulo: loja.nome,
      emoji: loja.emoji,
      descricao: itens.map((i) => `${i.quantidade}x ${i.produto.nome}`).join(', '),
      total,
      pagamento,
    });
    limparCarrinho();
    router.dismissTo('/pedidos');
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
      <Text style={estilos.titulo}>
        {loja.emoji} {loja.nome}
      </Text>

      <View style={estilos.cartao}>
        {itens.map((i) => (
          <View key={i.produto.id} style={estilos.linha}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '600', color: cores.texto }}>{i.produto.nome}</Text>
              <Text style={{ color: cores.textoSuave }}>{formatarPreco(i.produto.preco * i.quantidade)}</Text>
            </View>
            <Pressable onPress={() => remover(i.produto.id)} hitSlop={8}>
              <Text style={estilos.qtdBotao}>−</Text>
            </Pressable>
            <Text style={{ fontWeight: '700', minWidth: 18, textAlign: 'center' }}>{i.quantidade}</Text>
            <Pressable onPress={() => adicionar(loja.id, i.produto)} hitSlop={8}>
              <Text style={estilos.qtdBotao}>+</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <Text style={estilos.secao}>Endereço de entrega</Text>
      <TextInput
        value={endereco}
        onChangeText={setEndereco}
        placeholder="Rua, número, bairro e ponto de referência"
        placeholderTextColor={cores.textoSuave}
        style={estilos.campo}
        multiline
      />
      <TextInput
        value={observacao}
        onChangeText={setObservacao}
        placeholder="Observação (ex.: sem cebola, troco para R$ 50)"
        placeholderTextColor={cores.textoSuave}
        style={estilos.campo}
      />

      <Text style={estilos.secao}>Pagamento</Text>
      <EscolhaPagamento valor={pagamento} onChange={setPagamento} />

      <View style={estilos.cartao}>
        <View style={estilos.resumo}>
          <Text style={{ color: cores.textoSuave }}>Subtotal</Text>
          <Text>{formatarPreco(subtotal)}</Text>
        </View>
        <View style={estilos.resumo}>
          <Text style={{ color: cores.textoSuave }}>Taxa de entrega</Text>
          <Text>{formatarPreco(loja.taxaEntrega)}</Text>
        </View>
        <View style={estilos.resumo}>
          <Text style={{ fontWeight: '800', fontSize: 16 }}>Total</Text>
          <Text style={{ fontWeight: '800', fontSize: 16 }}>{formatarPreco(total)}</Text>
        </View>
      </View>

      <Botao
        titulo={endereco.trim() ? `Fazer pedido · ${formatarPreco(total)}` : 'Informe o endereço'}
        desabilitado={!endereco.trim()}
        onPress={finalizar}
      />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  titulo: { fontSize: 18, fontWeight: '800', color: cores.texto },
  secao: { fontSize: 16, fontWeight: '700', color: cores.texto, marginTop: 4 },
  cartao: {
    backgroundColor: cores.cartao,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: 14,
    gap: 12,
  },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qtdBotao: { fontSize: 22, fontWeight: '700', color: cores.primaria, paddingHorizontal: 6 },
  campo: {
    backgroundColor: cores.cartao,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: cores.texto,
  },
  resumo: { flexDirection: 'row', justifyContent: 'space-between' },
});
