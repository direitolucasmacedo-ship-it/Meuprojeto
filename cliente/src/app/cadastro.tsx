import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View, type KeyboardTypeOptions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EMAIL_CADASTROS, WHATSAPP_CADASTROS } from '@/config';
import { useApp } from '@/context/app-state';
import { GRUPOS, type GrupoId } from '@/data/cadastro';
import { Botao } from '@/ui/componentes';
import { NOME_APP, cores } from '@/ui/theme';
import { abrirEmail, abrirWhatsApp, formatarTelefone } from '@/whatsapp';

// Textos dos campos mudam conforme quem está se cadastrando
const CAMPOS: Record<
  GrupoId,
  { nome: string; local?: string; descricao: string; descricaoObrigatoria?: boolean; horario?: boolean; responsavel?: boolean; entrega?: boolean; instagram?: boolean }
> = {
  empresa: {
    nome: 'Nome da empresa',
    responsavel: true,
    local: 'Endereço (rua, número e bairro)',
    horario: true,
    descricao: 'O que vocês vendem ou fazem?',
    entrega: true,
    instagram: true,
  },
  profissional: {
    nome: 'Seu nome',
    local: 'Bairros ou região que você atende',
    horario: true,
    descricao: 'Quais serviços você faz?',
    instagram: true,
  },
  colaborador: {
    nome: 'Seu nome completo',
    local: 'Bairro onde você mora',
    descricao: 'Seu veículo (modelo, cor e placa)',
  },
  contato: {
    nome: 'Seu nome',
    descricao: 'Escreva sua mensagem',
    descricaoObrigatoria: true,
  },
};

function soDigitos(t: string) {
  return t.replace(/\D/g, '');
}

// Aceita (33) 99999-1234, 33999991234, +55 33 99999-1234...
function whatsappValido(t: string) {
  const d = soDigitos(t).replace(/^55(?=\d{10,11}$)/, '');
  return d.length === 10 || d.length === 11 ? '55' + d : null;
}

export default function Cadastro() {
  const params = useLocalSearchParams<{ grupo?: string }>();
  const inicial = GRUPOS.find((g) => g.id === params.grupo)?.id ?? null;
  const { cliente } = useApp();
  const insets = useSafeAreaInsets();

  const [grupoId, setGrupoId] = useState<GrupoId | null>(inicial);
  const [categoria, setCategoria] = useState('');
  const [outraCategoria, setOutraCategoria] = useState('');
  const [nome, setNome] = useState(cliente.nome);
  const [responsavel, setResponsavel] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [local, setLocal] = useState('');
  const [horario, setHorario] = useState('');
  const [descricao, setDescricao] = useState('');
  const [entrega, setEntrega] = useState(false);
  const [instagram, setInstagram] = useState('');
  const [enviado, setEnviado] = useState(false);

  const grupo = GRUPOS.find((g) => g.id === grupoId);
  const campos = grupoId ? CAMPOS[grupoId] : null;
  const numero = whatsappValido(whatsapp);
  const categoriaFinal = categoria === 'Outro' ? outraCategoria.trim() || 'Outro' : categoria;

  let pendencia = '';
  if (!categoria) pendencia = 'Escolha uma categoria';
  else if (!nome.trim()) pendencia = `Preencha: ${campos?.nome}`;
  else if (!numero) pendencia = 'Informe um WhatsApp válido com DDD';
  else if (campos?.descricaoObrigatoria && !descricao.trim()) pendencia = 'Escreva sua mensagem';

  // Ficha que chega para o dono do app. Blocos separados por linha em branco.
  function montarFicha() {
    if (!grupo || !campos || !numero) return '';
    const protocolo = Date.now().toString(36).toUpperCase().slice(-6);
    const titulo = grupo.id === 'contato' ? 'FALE CONOSCO' : 'NOVO CADASTRO';
    const linha = (rotulo: string, valor?: string | false) => (valor ? `*${rotulo}:* ${valor}` : '');
    const blocos = [
      [`*${titulo} — ${NOME_APP}*`, `Protocolo: #${protocolo}`],
      [linha('Tipo', grupo.nome), linha('Categoria', categoriaFinal)],
      [
        linha(campos.nome, nome.trim()),
        campos.responsavel && linha('Responsável', responsavel.trim()),
        linha('WhatsApp', formatarTelefone(numero)),
        campos.local && linha(campos.local.split(' (')[0], local.trim()),
        campos.horario && linha('Horário', horario.trim()),
        campos.entrega && linha('Faz entrega', entrega ? 'Sim' : 'Não'),
        campos.instagram && instagram.trim() && linha('Instagram', '@' + instagram.trim().replace(/^@/, '')),
      ],
      descricao.trim() ? [`*${grupo.id === 'contato' ? 'Mensagem' : campos.descricao.replace('?', '')}:*`, descricao.trim()] : [],
      [`Enviado pelo app em ${new Date().toLocaleDateString('pt-BR')}`],
    ];
    return blocos
      .map((bloco) => bloco.filter(Boolean).join('\n'))
      .filter(Boolean)
      .join('\n\n');
  }

  function enviarWhatsApp() {
    const ficha = montarFicha();
    if (!ficha) return;
    abrirWhatsApp(WHATSAPP_CADASTROS, ficha);
    setEnviado(true);
  }

  function enviarEmail() {
    const ficha = montarFicha();
    if (!ficha || !grupo) return;
    abrirEmail(EMAIL_CADASTROS, `[${NOME_APP}] ${grupo.nome} — ${categoriaFinal}: ${nome.trim()}`, ficha.replace(/\*/g, ''));
    setEnviado(true);
  }

  function trocarGrupo(id: GrupoId | null) {
    setGrupoId(id);
    setCategoria('');
    setEnviado(false);
  }

  // Tela de sucesso
  if (enviado && grupo) {
    return (
      <View style={[estilos.sucesso, { paddingBottom: insets.bottom + 24 }]}>
        <Stack.Screen options={{ title: 'Pronto!' }} />
        <Text style={{ fontSize: 64 }}>🎉</Text>
        <Text style={estilos.sucessoTitulo}>Quase lá!</Text>
        <Text style={estilos.sucessoTexto}>
          Sua ficha foi aberta no WhatsApp (ou e-mail). Toque em <Text style={{ fontWeight: '800' }}>Enviar</Text> por lá
          para ela chegar até a gente.
        </Text>
        <Text style={estilos.sucessoTexto}>
          {grupo.id === 'contato'
            ? 'Vamos responder o mais rápido possível.'
            : 'Vamos conferir seus dados e avisar quando você estiver no app.'}
        </Text>
        <View style={{ width: '100%', gap: 10, marginTop: 16 }}>
          <Botao titulo="Abrir o WhatsApp de novo" onPress={enviarWhatsApp} cor={cores.whatsapp} />
          <Pressable onPress={() => trocarGrupo(null)} style={{ alignItems: 'center', padding: 10 }}>
            <Text style={{ color: cores.primaria, fontWeight: '700' }}>Fazer outro cadastro</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: cores.fundo }}>
      <Stack.Screen options={{ title: grupo ? grupo.nome : 'Cadastre-se ou fale conosco' }} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 14 }} keyboardShouldPersistTaps="handled">
        {/* Passo 1: quem é você */}
        {!grupo && (
          <>
            <View style={estilos.intro}>
              <Text style={estilos.introTitulo}>Faça parte do {NOME_APP}</Text>
              <Text style={estilos.introTexto}>
                Cadastre sua empresa ou seu serviço e seja encontrado por toda Capelinha. É grátis!
              </Text>
            </View>
            <Text style={estilos.pergunta}>Quem é você?</Text>
            {GRUPOS.map((g) => (
              <Pressable
                key={g.id}
                onPress={() => trocarGrupo(g.id)}
                style={({ pressed }) => [estilos.grupo, pressed && { backgroundColor: cores.primariaClara }]}>
                <View style={estilos.grupoIcone}>
                  <Text style={{ fontSize: 26 }}>{g.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={estilos.grupoNome}>{g.nome}</Text>
                  <Text style={estilos.grupoDesc}>{g.descricao}</Text>
                </View>
                <Text style={{ color: cores.textoSuave, fontSize: 22 }}>›</Text>
              </Pressable>
            ))}
          </>
        )}

        {/* Passo 2: categoria + dados */}
        {grupo && campos && (
          <>
            <Pressable onPress={() => trocarGrupo(null)} style={estilos.trocar}>
              <Text style={{ fontSize: 20 }}>{grupo.emoji}</Text>
              <Text style={{ flex: 1, color: cores.textoForte, fontWeight: '600' }}>{grupo.nome}</Text>
              <Text style={{ color: cores.primaria, fontWeight: '700', fontSize: 13 }}>Trocar</Text>
            </Pressable>

            <Text style={estilos.pergunta}>{grupo.id === 'contato' ? 'Sobre o que você quer falar?' : 'Qual é a sua categoria?'}</Text>
            <View style={estilos.chips}>
              {grupo.categorias.map((c) => {
                const ativo = categoria === c;
                return (
                  <Pressable key={c} onPress={() => setCategoria(c)} style={[estilos.chip, ativo && estilos.chipAtivo]}>
                    <Text style={[estilos.chipTexto, ativo && { color: '#fff' }]}>{c}</Text>
                  </Pressable>
                );
              })}
            </View>
            {categoria === 'Outro' && (
              <Campo valor={outraCategoria} onChange={setOutraCategoria} rotulo="Qual categoria?" placeholder="Ex.: Sorveteria" />
            )}

            <Text style={estilos.pergunta}>Seus dados</Text>
            <Campo valor={nome} onChange={setNome} rotulo={campos.nome} obrigatorio />
            {campos.responsavel && <Campo valor={responsavel} onChange={setResponsavel} rotulo="Nome do responsável" />}
            <Campo
              valor={whatsapp}
              onChange={setWhatsapp}
              rotulo="WhatsApp com DDD"
              placeholder="(33) 99999-1234"
              teclado="phone-pad"
              obrigatorio
              erro={whatsapp.length > 0 && !numero ? 'Confira o número (DDD + número)' : ''}
            />
            {campos.local && <Campo valor={local} onChange={setLocal} rotulo={campos.local} />}
            {campos.horario && (
              <Campo valor={horario} onChange={setHorario} rotulo="Horário de atendimento" placeholder="Ex.: Seg a Sex 8h–18h, Sáb 8h–12h" />
            )}
            <Campo
              valor={descricao}
              onChange={setDescricao}
              rotulo={campos.descricao}
              obrigatorio={campos.descricaoObrigatoria}
              multilinha
            />
            {campos.instagram && <Campo valor={instagram} onChange={setInstagram} rotulo="Instagram (opcional)" placeholder="@seuperfil" />}
            {campos.entrega && (
              <View style={estilos.linhaSwitch}>
                <Text style={{ flex: 1, color: cores.textoForte, fontSize: 15 }}>Vocês fazem entrega?</Text>
                <Switch value={entrega} onValueChange={setEntrega} trackColor={{ true: cores.primaria, false: cores.borda }} />
              </View>
            )}
          </>
        )}
      </ScrollView>

      {grupo && (
        <View style={[estilos.rodape, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          {pendencia ? <Text style={estilos.pendencia}>{pendencia}</Text> : null}
          <Botao titulo="Enviar pelo WhatsApp" onPress={enviarWhatsApp} desabilitado={!!pendencia} cor={cores.whatsapp} />
          <Pressable onPress={enviarEmail} disabled={!!pendencia} style={{ alignItems: 'center', paddingVertical: 6 }}>
            <Text style={{ color: pendencia ? cores.textoSuave : cores.primaria, fontWeight: '700', fontSize: 13 }}>
              ou enviar por e-mail
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function Campo({
  valor,
  onChange,
  rotulo,
  placeholder,
  obrigatorio,
  multilinha,
  teclado,
  erro,
}: {
  valor: string;
  onChange: (t: string) => void;
  rotulo: string;
  placeholder?: string;
  obrigatorio?: boolean;
  multilinha?: boolean;
  teclado?: KeyboardTypeOptions;
  erro?: string;
}) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={estilos.rotulo}>
        {rotulo}
        {obrigatorio && <Text style={{ color: cores.primaria }}> *</Text>}
      </Text>
      <TextInput
        value={valor}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={cores.textoSuave}
        keyboardType={teclado}
        multiline={multilinha}
        style={[estilos.campo, multilinha && { minHeight: 90, textAlignVertical: 'top' }, !!erro && { borderColor: '#DC2626' }]}
      />
      {!!erro && <Text style={{ color: '#DC2626', fontSize: 12 }}>{erro}</Text>}
    </View>
  );
}

const estilos = StyleSheet.create({
  intro: { backgroundColor: cores.marinho, borderRadius: 18, padding: 18, gap: 6 },
  introTitulo: { color: '#fff', fontSize: 20, fontWeight: '800' },
  introTexto: { color: '#C9D6F2', fontSize: 14, lineHeight: 20 },
  pergunta: { fontSize: 17, fontWeight: '800', color: cores.textoForte, marginTop: 6 },
  grupo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 16,
    padding: 14,
  },
  grupoIcone: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: cores.primariaClara,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grupoNome: { fontSize: 16, fontWeight: '700', color: cores.textoForte },
  grupoDesc: { fontSize: 13, color: cores.textoSuave, marginTop: 2 },
  trocar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: cores.primariaClara,
    borderRadius: 12,
    padding: 12,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderColor: cores.borda, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 8 },
  chipAtivo: { backgroundColor: cores.primaria, borderColor: cores.primaria },
  chipTexto: { fontSize: 13, color: cores.texto, fontWeight: '600' },
  rotulo: { fontSize: 13, fontWeight: '600', color: cores.texto },
  campo: {
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: cores.textoForte,
  },
  linhaSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 12,
    padding: 12,
  },
  rodape: {
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
    backgroundColor: cores.fundo,
    gap: 4,
  },
  pendencia: { textAlign: 'center', color: cores.textoSuave, fontSize: 13 },
  sucesso: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 10, backgroundColor: cores.fundo },
  sucessoTitulo: { fontSize: 24, fontWeight: '800', color: cores.textoForte },
  sucessoTexto: { fontSize: 15, color: cores.texto, textAlign: 'center', lineHeight: 22 },
});
