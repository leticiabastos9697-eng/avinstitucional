export const BRAND = {
  navy: '#011B5C',
  blue: '#174290',
  orange: '#E4650E',
};

export const TURMA_COLORS = [BRAND.navy, BRAND.orange, BRAND.blue, '#548235', '#7030A0', '#0F9ED5'];

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
