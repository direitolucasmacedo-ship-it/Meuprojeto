import { Linking } from 'react-native';

// Abre o WhatsApp com a mensagem já escrita para o número informado.
export async function abrirWhatsApp(numero: string, mensagem: string) {
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
  try {
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}
