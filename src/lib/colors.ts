export const TURMA_COLORS = ['#1F3864', '#ED7D31', '#548235', '#7030A0', '#C00000', '#0F9ED5'];

export const CANONICAL_OPTION_ORDER = [
  'Péssimo',
  'Muito ruim',
  'Ruim',
  'Regular',
  'Bom',
  'Muito bom',
  'Não',
  'Sim',
];

export function sortOptionLabels(labels: string[]): string[] {
  return [...labels].sort((a, b) => {
    const ia = CANONICAL_OPTION_ORDER.indexOf(a);
    const ib = CANONICAL_OPTION_ORDER.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}
