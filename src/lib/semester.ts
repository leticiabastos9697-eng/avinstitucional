const MONTHS: Record<string, number> = {
  jan: 1, fev: 2, mar: 3, abr: 4, mai: 5, jun: 6,
  jul: 7, ago: 8, set: 9, out: 10, nov: 11, dez: 12,
};

/** Parses strings like "MAR/2026" or "março/2026" into { month, year }. */
export function parseMesAno(value: string): { month: number; year: number } | null {
  const match = value.trim().match(/^([a-zçã]+)\s*\/\s*(\d{4})$/i);
  if (!match) return null;
  const key = match[1].slice(0, 3).toLowerCase().replace('ç', 'c').replace('ã', 'a');
  const month = MONTHS[key];
  if (!month) return null;
  return { month, year: Number(match[2]) };
}

export function semesterOf(value: string): 1 | 2 | null {
  const parsed = parseMesAno(value);
  if (!parsed) return null;
  return parsed.month <= 6 ? 1 : 2;
}

export function semesterLabel(value: string): string {
  const parsed = parseMesAno(value);
  if (!parsed) return value;
  const sem = parsed.month <= 6 ? '1º semestre' : '2º semestre';
  return `${sem} ${parsed.year}`;
}
