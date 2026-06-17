export interface ObjectiveOption {
  label: string;
  count: number;
}

export interface ParsedQuestion {
  key: string;
  text: string;
  type: 'objetiva' | 'aberta';
  // objetiva
  options?: ObjectiveOption[];
  // aberta
  answers?: string[];
}

export interface TurmaInfo {
  nome: string;
  inicio: string;
  fim: string;
  qtdIniciaram: number;
  qtdEvadidos: number;
  qtdTransferidos: number;
  percEvasao: number;
  percInadimplencia: number;
}

export interface Turma extends TurmaInfo {
  id: string;
  respondentes: number;
  ativos: number;
  taxaResposta: number;
  questions: ParsedQuestion[];
}
