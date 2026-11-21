import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EMPRESAS, TIPOS, type TipoEmpresa } from '@/data/empresas';
import { CartaoEmpresa } from '@/ui/empresa';
import { ligar } from '@/whatsapp';
import { cores } from '@/ui/theme';

function normalizar(t: string) {
  return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export default function Empresas() {
  const [busca, setBusca] = useState('');
  const [tipo, setTipo] = useState<TipoEmpresa | 'todos'>('todos');
  const termo = normalizar(busca.trim());

  const emergencias = EMPRESAS.filter((e) => e.emergencia && e.telefone);
  const lista = EMPRESAS.filter((e) => tipo === 'todos' || e.tipo === tipo)
    .filter((e) => !termo || normalizar(`${e.nome} ${e.ramo} ${e.descricao}`).includes(termo))
    .sort((a, b) => Number(!!b.verificada) - Number(!!a.verificada) || a.nome.localeCompare(b.nome));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: cores.fundo }} edges={['top']}>
      <View style={estilos.cabecalho}>
        <Text style={estilos.titulo}>Guia de Capelinha</Text>
        <Text style={estilos.sub}>Empresas, profissionais e serviços públicos</Text>
        <View style={estilos.campoCaixa}>
          <Text>🔍</Text>
          <TextInput
            value={busca}
            onChangeText={setBusca}
            placeholder="Buscar empresa, profissional, serviço..."
            placeholderTextColor={cores.textoSuave}
            style={estilos.campo}
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} style={{ marginHorizontal: -16 }}>
          <View style={{ width: 8 }} />
          {TIPOS.map((t) => {
            const ativo = tipo === t.id;
            return (
              <Pressable key={t.id} onPress={() => setTipo(t.id)} style={[estilos.chip, ativo && estilos.chipAtivo]}>
                <Text style={[estilos.chipTexto, ativo && { color: '#fff' }]}>{t.nome}</Text>
              </Pressable>
            );
          })}
          <View style={{ width: 8 }} />
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
        {/* Emergência sempre à mão */}
        {!termo && (tipo === 'todos' || tipo === 'publico') && (
          <View style={estilos.emergencia}>
            <Text style={estilos.emergenciaTitulo}>🚨 Emergência — ligação gratuita</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {emergencias.map((e) => (
                <Pressable key={e.id} onPress={() => ligar(e.telefone!)} style={estilos.emergenciaBotao}>
                  <Text style={{ fontSize: 20 }}>{e.emoji}</Text>
                  <Text style={estilos.emergenciaNumero}>{e.telefone}</Text>
                  <Text style={estilos.emergenciaNome} numberOfLines={1}>
                    {e.nome.replace('Corpo de ', '').replace('Polícia Militar', 'Polícia')}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        <Text style={estilos.contagem}>
          {lista.length} {lista.length === 1 ? 'resultado' : 'resultados'}
        </Text>
        {lista.map((e) => (
          <CartaoEmpresa key={e.id} empresa={e} />
        ))}
        {lista.length === 0 && (
          <Text style={{ color: cores.textoSuave, textAlign: 'center', marginTop: 32 }}>Nada encontrado.</Text>
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
  emergencia: { margin: 16, marginBottom: 4, padding: 12, borderRadius: 16, backgroundColor: '#FDECEC', gap: 10 },
  emergenciaTitulo: { fontSize: 13, fontWeight: '800', color: '#B91C1C' },
  emergenciaBotao: { flex: 1, backgroundColor: '#fff', borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  emergenciaNumero: { fontSize: 18, fontWeight: '900', color: '#DC2626' },
  emergenciaNome: { fontSize: 11, color: cores.texto },
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
