import { Linking } from 'react-native';

import { CIDADE } from '@/ui/theme';

// Abre o WhatsApp com a mensagem já escrita para o número informado.
export async function abrirWhatsApp(numero: string, mensagem = '') {
  const url = `https://wa.me/${numero}${mensagem ? `?text=${encodeURIComponent(mensagem)}` : ''}`;
  try {
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}

// Abre o discador do celular com o número (55 + DDD + número, ou curto como '192')
export async function ligar(numero: string) {
  try {
    await Linking.openURL(numero.length <= 5 ? `tel:${numero}` : `tel:+${numero}`);
  } catch {
    // em computadores sem discador, não faz nada
  }
}

// Abre o endereço no app de mapas
export async function abrirMapa(endereco: string) {
  const busca = encodeURIComponent(`${endereco}, ${CIDADE}`);
  await Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${busca}`);
}

// (33) 99999-1234 a partir de 5533999991234
export function formatarTelefone(numero: string) {
  if (numero.length <= 5) return numero; // números curtos: 190, 192, 116...
  const n = numero.replace(/^55/, '');
  const ddd = n.slice(0, 2);
  const resto = n.slice(2);
  const meio = resto.length === 9 ? 5 : 4;
  return `(${ddd}) ${resto.slice(0, meio)}-${resto.slice(meio)}`;
}

// Abre o app de e-mail com assunto e texto preenchidos
export async function abrirEmail(para: string, assunto: string, corpo: string) {
  const url = `mailto:${para}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
  try {
    await Linking.openURL(url);
  } catch {
    // sem app de e-mail configurado
  }
}
