import { useMemo, useState } from 'react';
import type { Turma } from '../types';
import { semesterLabel } from '../lib/semester';
import SummaryCard from './SummaryCard';
import QuestionChart from './QuestionChart';
import OpenQuestionList from './OpenQuestionList';

interface Props {
  turmas: Turma[];
  onExport: (turmas: Turma[]) => void;
  onAddTurma: () => void;
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

const TODOS = 'Todos os períodos';

export default function Dashboard({ turmas, onExport, onAddTurma }: Props) {
  const [periodo, setPeriodo] = useState(TODOS);

  const periodos = useMemo(() => {
    const set = new Set<string>();
    turmas.forEach((t) => set.add(semesterLabel(t.mesAvaliacao)));
    return [TODOS, ...Array.from(set).sort()];
  }, [turmas]);

  const filtered = useMemo(
    () => (periodo === TODOS ? turmas : turmas.filter((t) => semesterLabel(t.mesAvaliacao) === periodo)),
    [turmas, periodo]
  );

  const questions = unionQuestionsInOrder(filtered);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>3. Resultados da Tabulação</h2>
        <div className="actions">
          <button className="secondary" onClick={onAddTurma}>+ Adicionar outra turma</button>
          <button onClick={() => onExport(filtered)}>Exportar para PowerPoint</button>
        </div>
      </div>

      {periodos.length > 2 && (
        <div className="period-filter">
          {periodos.map((p) => (
            <button
              key={p}
              className={p === periodo ? 'period-filter__btn is-active' : 'period-filter__btn'}
              onClick={() => setPeriodo(p)}
              type="button"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="muted">Nenhuma turma encontrada para este período.</p>
      ) : (
        <>
          <div className="summary-row">
            {filtered.map((t) => (
              <SummaryCard key={t.id} turma={t} />
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
