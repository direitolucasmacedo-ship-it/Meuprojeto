import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EMPRESAS, TIPOS, type TipoEmpresa } from '@/data/empresas';
import { CartaoEmpresa } from '@/ui/empresa';
import { cores } from '@/ui/theme';

function normalizar(t: string) {
  return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export default function Empresas() {
  const [busca, setBusca] = useState('');
  const [tipo, setTipo] = useState<TipoEmpresa | 'todos'>('todos');
  const termo = normalizar(busca.trim());

  const lista = EMPRESAS.filter((e) => tipo === 'todos' || e.tipo === tipo)
    .filter((e) => !termo || normalizar(`${e.nome} ${e.ramo} ${e.descricao}`).includes(termo))
    .sort((a, b) => Number(!!b.verificada) - Number(!!a.verificada) || a.nome.localeCompare(b.nome));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: cores.fundo }} edges={['top']}>
      <View style={estilos.cabecalho}>
        <Text style={estilos.titulo}>Guia de empresas</Text>
        <Text style={estilos.sub}>Fale direto com o comércio de Capelinha</Text>
        <View style={estilos.campoCaixa}>
          <Text>🔍</Text>
          <TextInput
            value={busca}
            onChangeText={setBusca}
            placeholder="Buscar empresa, produto ou serviço"
            placeholderTextColor={cores.textoSuave}
            style={estilos.campo}
          />
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {TIPOS.map((t) => {
            const ativo = tipo === t.id;
            return (
              <Pressable key={t.id} onPress={() => setTipo(t.id)} style={[estilos.chip, ativo && estilos.chipAtivo]}>
                <Text style={[estilos.chipTexto, ativo && { color: '#fff' }]}>{t.nome}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
        <Text style={estilos.contagem}>
          {lista.length} {lista.length === 1 ? 'empresa' : 'empresas'}
        </Text>
        {lista.map((e) => (
          <CartaoEmpresa key={e.id} empresa={e} />
        ))}
        {lista.length === 0 && (
          <Text style={{ color: cores.textoSuave, textAlign: 'center', marginTop: 32 }}>Nenhuma empresa encontrada.</Text>
        )}

        <Pressable
          onPress={() => router.push({ pathname: '/cadastro', params: { grupo: 'empresa' } })}
          style={estilos.cadastre}>
          <Text style={{ fontSize: 26 }}>🏢</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>Tem empresa ou presta serviço?</Text>
            <Text style={{ color: '#D6E4FF', fontSize: 13 }}>Cadastre-se grátis e seja encontrado</Text>
          </View>
          <Text style={{ color: '#fff', fontSize: 22 }}>›</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  cabecalho: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, gap: 10, borderBottomWidth: 1, borderBottomColor: cores.borda },
  titulo: { fontSize: 24, fontWeight: '800', color: cores.textoForte },
  sub: { fontSize: 14, color: cores.textoSuave, marginTop: -6 },
  campoCaixa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: cores.fundoSuave,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  campo: { flex: 1, paddingVertical: 12, fontSize: 15, color: cores.textoForte },
  chip: { borderWidth: 1, borderColor: cores.borda, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 7 },
  chipAtivo: { backgroundColor: cores.primaria, borderColor: cores.primaria },
  chipTexto: { fontSize: 13, color: cores.texto, fontWeight: '600' },
  contagem: { fontSize: 12, color: cores.textoSuave, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  cadastre: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    margin: 16,
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: cores.primaria,
  },
});
