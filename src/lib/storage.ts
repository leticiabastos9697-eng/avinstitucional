import type { Turma } from '../types';

const STORAGE_KEY = 'avinstitucional:turmas';

export function loadTurmas(): Turma[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Turma[]) : [];
  } catch {
    return [];
  }
}

export function saveTurmas(turmas: Turma[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(turmas));
  } catch {
    // armazenamento indisponível ou cota excedida — ignora
  }
}
