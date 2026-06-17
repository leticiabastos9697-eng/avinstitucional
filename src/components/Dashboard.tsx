import { useMemo, useState } from 'react';
import type { Turma } from '../types';
import { parseMesAno } from '../lib/semester';
import SummaryCard from './SummaryCard';
import QuestionChart from './QuestionChart';
import OpenQuestionList from './OpenQuestionList';

interface Props {
  turmas: Turma[];
  onExport: (turmas: Turma[]) => void;
  onAddTurma: () => void;
  onDeleteTurma: (id: string) => void;
}

function monthValue(value: string): number | null {
  const parsed = parseMesAno(value);
  if (!parsed) return null;
  return parsed.year * 12 + (parsed.month - 1);
}

interface QuestionRef {
  key: string;
  text: string;
  type: 'objetiva' | 'aberta';
}

function unionQuestionsInOrder(turmas: Turma[]): QuestionRef[] {
  const seen = new Set<string>();
  const result: QuestionRef[] = [];
  turmas.forEach((t) => {
    t.questions.forEach((q) => {
      if (!seen.has(q.key)) {
        seen.add(q.key);
        result.push({ key: q.key, text: q.text, type: q.type });
      }
    });
  });
  return result;
}

export default function Dashboard({ turmas, onExport, onAddTurma, onDeleteTurma }: Props) {
  const [selectedTurmas, setSelectedTurmas] = useState<Set<string>>(new Set());
  const [periodoDe, setPeriodoDe] = useState('');
  const [periodoAte, setPeriodoAte] = useState('');

  function toggleTurma(id: string) {
    setSelectedTurmas((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const filtered = useMemo(() => {
    const de = monthValue(periodoDe);
    const ate = monthValue(periodoAte);
    return turmas.filter((t) => {
      if (selectedTurmas.size > 0 && !selectedTurmas.has(t.id)) return false;
      const valor = monthValue(t.mesAvaliacao);
      if (de !== null && (valor === null || valor < de)) return false;
      if (ate !== null && (valor === null || valor > ate)) return false;
      return true;
    });
  }, [turmas, selectedTurmas, periodoDe, periodoAte]);

  const questions = unionQuestionsInOrder(filtered);

  function handleDelete(id: string, nome: string) {
    if (window.confirm(`Excluir a importação da turma "${nome}"? Essa ação não pode ser desfeita.`)) {
      onDeleteTurma(id);
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>3. Resultados da Tabulação</h2>
        <div className="actions">
          <button className="secondary" onClick={onAddTurma}>+ Adicionar outra turma</button>
          <button onClick={() => onExport(filtered)}>Exportar para PowerPoint</button>
        </div>
      </div>

      <div className="filters-panel">
        <div className="filter-group">
          <span className="filter-group__label">Turma</span>
          <div className="turma-filter">
            {turmas.map((t) => (
              <label key={t.id} className="turma-filter__item">
                <input
                  type="checkbox"
                  checked={selectedTurmas.has(t.id)}
                  onChange={() => toggleTurma(t.id)}
                />
                {t.nome}
              </label>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <span className="filter-group__label">Período da avaliação</span>
          <div className="period-range">
            <input
              placeholder="De (ex: MAR/2026)"
              value={periodoDe}
              onChange={(e) => setPeriodoDe(e.target.value)}
            />
            <span className="arrow">→</span>
            <input
              placeholder="Até (ex: MAR/2027)"
              value={periodoAte}
              onChange={(e) => setPeriodoAte(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="muted">Nenhuma turma encontrada para este filtro.</p>
      ) : (
        <>
          <div className="summary-row">
            {filtered.map((t) => (
              <SummaryCard key={t.id} turma={t} onDelete={() => handleDelete(t.id, t.nome)} />
            ))}
          </div>

          {questions.map((q) =>
            q.type === 'objetiva' ? (
              <QuestionChart key={q.key} questionKey={q.key} questionText={q.text} turmas={filtered} />
            ) : (
              <OpenQuestionList key={q.key} questionKey={q.key} questionText={q.text} turmas={filtered} />
            )
          )}
        </>
      )}
    </div>
  );
}
