import { useRef, useState } from 'react';
import { parseSpreadsheet, detectQuestions } from '../lib/parse';
import type { ParsedQuestion } from '../types';

interface Props {
  onParsed: (data: { respondentes: number; questions: ParsedQuestion[]; fileName: string }) => void;
}

export default function ImportStep({ onParsed }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setLoading(true);
    try {
      const rows = await parseSpreadsheet(file);
      if (rows.length === 0) {
        setError('O arquivo não contém respostas.');
        return;
      }
      const questions = detectQuestions(rows);
      onParsed({ respondentes: rows.length, questions, fileName: file.name });
    } catch (e) {
      setError('Não foi possível ler o arquivo. Verifique se é um XLSX ou CSV exportado do Google Forms.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>1. Importar respostas</h2>
      <p className="muted">
        Selecione o arquivo XLSX ou CSV exportado do Google Forms para esta turma.
      </p>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      {loading && <p>Lendo arquivo...</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
