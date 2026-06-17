import type { TurmaInfo } from '../types';

export function calcAtivos(info: Pick<TurmaInfo, 'qtdIniciaram' | 'qtdEvadidos' | 'qtdTransferidos'>): number {
  return info.qtdIniciaram - info.qtdEvadidos - info.qtdTransferidos;
}

export function calcTaxaResposta(respondentes: number, ativos: number): number {
  if (ativos <= 0) return 0;
  return (respondentes / ativos) * 100;
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}
