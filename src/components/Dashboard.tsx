import type { Turma } from '../types';
import SummaryCard from './SummaryCard';
import QuestionChart from './QuestionChart';
import OpenQuestionList from './OpenQuestionList';

interface Props {
  turmas: Turma[];
  onExport: () => void;
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

export default function Dashboard({ turmas, onExport, onAddTurma }: Props) {
  const questions = unionQuestionsInOrder(turmas);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>3. Resultados da Tabulação</h2>
        <div className="actions">
          <button className="secondary" onClick={onAddTurma}>+ Adicionar outra turma</button>
          <button onClick={onExport}>Exportar para PowerPoint</button>
        </div>
      </div>

      <div className="summary-row">
        {turmas.map((t) => (
          <SummaryCard key={t.id} turma={t} />
        ))}
      </div>

      {questions.map((q) =>
        q.type === 'objetiva' ? (
          <QuestionChart key={q.key} questionKey={q.key} questionText={q.text} turmas={turmas} />
        ) : (
          <OpenQuestionList key={q.key} questionKey={q.key} questionText={q.text} turmas={turmas} />
        )
      )}
    </div>
  );
}
