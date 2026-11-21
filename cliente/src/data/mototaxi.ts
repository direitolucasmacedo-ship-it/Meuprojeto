// Mototaxistas de EXEMPLO (fictícios). Na versão real, cada mototaxista terá
// o app do colaborador, que envia a localização e diz se está disponível.

export type Mototaxista = {
  id: string;
  nome: string;
  moto: string;
  cor: string;
  placa: string;
  avaliacao: number;
  corridas: number;
  whatsapp: string;
  disponivel: boolean;
};

export const MOTOTAXISTAS: Mototaxista[] = [
  { id: 'm1', nome: 'João', moto: 'Honda CG 160', cor: 'Vermelha', placa: 'ABC-1D23', avaliacao: 4.9, corridas: 812, whatsapp: '5533900000001', disponivel: true },
  { id: 'm2', nome: 'Carlos', moto: 'Yamaha Factor 150', cor: 'Preta', placa: 'QWE-4F56', avaliacao: 4.8, corridas: 455, whatsapp: '5533900000002', disponivel: true },
  { id: 'm3', nome: 'Rafael', moto: 'Honda Bros 160', cor: 'Branca', placa: 'RTY-7G89', avaliacao: 4.7, corridas: 230, whatsapp: '5533900000003', disponivel: false },
  { id: 'm4', nome: 'Pedro', moto: 'Honda Pop 110i', cor: 'Azul', placa: 'UIO-0H12', avaliacao: 4.9, corridas: 1020, whatsapp: '5533900000004', disponivel: true },
];

// SIMULAÇÃO: escolhe um mototaxista disponível e inventa a distância.
// Na versão real: o servidor compara o GPS do cliente com o dos mototaxistas.
export function buscarMaisProximo(): { mototaxista: Mototaxista; minutos: number; distanciaKm: number } | null {
  const livres = MOTOTAXISTAS.filter((m) => m.disponivel);
  if (livres.length === 0) return null;
  const mototaxista = livres[Math.floor(Math.random() * livres.length)];
  const distanciaKm = 0.3 + Math.random() * 1.5;
  const minutos = Math.max(2, Math.round(distanciaKm * 3));
  return { mototaxista, minutos, distanciaKm };
}
