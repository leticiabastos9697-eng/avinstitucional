import type { Turma } from '../types';

interface Props {
  questionText: string;
  questionKey: string;
  turmas: Turma[];
}

export default function OpenQuestionList({ questionText, questionKey, turmas }: Props) {
  const relevant = turmas
    .map((t) => ({ turma: t, q: t.questions.find((qq) => qq.key === questionKey && qq.type === 'aberta') }))
    .filter((r) => r.q && r.q.answers && r.q.answers.length > 0);

  if (relevant.length === 0) return null;

  return (
    <div className="question-block">
      <h3>{questionText}</h3>
      <div className="open-answers-grid">
        {relevant.map(({ turma, q }) => (
          <div key={turma.id} className="open-answers-col">
            <h4>{turma.nome}</h4>
            <ul>
              {q!.answers!.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
