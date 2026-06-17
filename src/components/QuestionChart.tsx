import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import type { Turma } from '../types';
import { TURMA_COLORS, sortOptionLabels } from '../lib/colors';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

interface Props {
  questionText: string;
  turmas: Turma[];
  questionKey: string;
}

export default function QuestionChart({ questionText, turmas, questionKey }: Props) {
  const relevant = turmas.filter((t) => t.questions.some((q) => q.key === questionKey && q.type === 'objetiva'));
  if (relevant.length === 0) return null;

  const labelSet = new Set<string>();
  relevant.forEach((t) => {
    const q = t.questions.find((qq) => qq.key === questionKey);
    q?.options?.forEach((o) => labelSet.add(o.label));
  });
  const labels = sortOptionLabels(Array.from(labelSet));

  const datasets = relevant.map((t, idx) => {
    const q = t.questions.find((qq) => qq.key === questionKey);
    const total = q?.options?.reduce((s, o) => s + o.count, 0) ?? 0;
    const data = labels.map((label) => {
      const opt = q?.options?.find((o) => o.label === label);
      return opt && total > 0 ? Math.round((opt.count / total) * 1000) / 10 : 0;
    });
    return {
      label: t.nome,
      data,
      backgroundColor: TURMA_COLORS[idx % TURMA_COLORS.length],
    };
  });

  return (
    <div className="question-block">
      <h3>{questionText}</h3>
      <div className="chart-wrap">
        <Bar
          data={{ labels, datasets }}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'bottom' },
              datalabels: {
                anchor: 'end',
                align: 'top',
                formatter: (v: number) => `${v}%`,
              },
            },
            scales: {
              y: { beginAtZero: true, ticks: { callback: (v) => `${v}%` } },
            },
          }}
        />
      </div>
      <div className="footer-rates">
        {relevant.map((t) => (
          <span key={t.id}>{t.nome} = {t.respondentes} / {Math.round(t.taxaResposta)}%</span>
        ))}
      </div>
    </div>
  );
}
