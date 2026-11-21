import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { CATEGORIAS, LOJAS } from '@/data/mock';
import { BarraCarrinho, CartaoLoja } from '@/ui/componentes';
import { cores } from '@/ui/theme';

export default function TelaCategoria() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const categoria = CATEGORIAS.find((c) => c.id === id);
  const lojas = LOJAS.filter((l) => l.categoria === id).sort((a, b) => Number(b.aberta) - Number(a.aberta));

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: categoria ? `${categoria.emoji} ${categoria.nome}` : 'Categoria' }} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 100 }}>
        {lojas.length === 0 && (
          <Text style={{ color: cores.textoSuave, textAlign: 'center', marginTop: 40 }}>
            Ainda não há parceiros nesta categoria.
          </Text>
        )}
        {lojas.map((l) => (
          <CartaoLoja key={l.id} loja={l} />
        ))}
      </ScrollView>
      <BarraCarrinho />
    </View>
  );
}
