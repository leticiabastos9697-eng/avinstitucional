import * as XLSX from 'xlsx';
import type { ParsedQuestion } from '../types';

const METADATA_PATTERNS = [
  /carimbo de data\/hora/i,
  /^timestamp$/i,
  /nome completo/i,
  /^e-?mail/i,
  /endere[cç]o de e-?mail/i,
];

function isMetadataColumn(header: string): boolean {
  return METADATA_PATTERNS.some((re) => re.test(header.trim()));
}

export async function parseSpreadsheet(file: File): Promise<Record<string, unknown>[]> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array' });
  const sheetName = wb.SheetNames[0];
  const sheet = wb.Sheets[sheetName];
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });
}

function cellToText(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

/**
 * Classifies each non-metadata column as an objective (closed-option) or open question,
 * based on how repetitive the answers are: few distinct values shared across many
 * respondents indicates a scale/multiple-choice question.
 */
export function detectQuestions(rows: Record<string, unknown>[]): ParsedQuestion[] {
  if (rows.length === 0) return [];
  const headers = Object.keys(rows[0]);
  const questions: ParsedQuestion[] = [];

  headers.forEach((header) => {
    if (isMetadataColumn(header)) return;

    const values = rows.map((r) => cellToText(r[header])).filter((v) => v !== '');
    if (values.length === 0) {
      // no answers at all (e.g. unused "Por quê?" column) - still register as open/empty
      questions.push({ key: header, text: header, type: 'aberta', answers: [] });
      return;
    }

    const distinct = Array.from(new Set(values));
    const distinctRatio = distinct.length / values.length;
    const isObjective = distinct.length <= 8 && distinctRatio <= 0.6;

    if (isObjective) {
      const counts = new Map<string, number>();
      values.forEach((v) => counts.set(v, (counts.get(v) ?? 0) + 1));
      questions.push({
        key: header,
        text: header,
        type: 'objetiva',
        options: Array.from(counts.entries()).map(([label, count]) => ({ label, count })),
      });
    } else {
      questions.push({
        key: header,
        text: header,
        type: 'aberta',
        answers: values,
      });
    }
  });

  return questions;
}
