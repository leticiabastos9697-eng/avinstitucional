import pptxgen from 'pptxgenjs';
import type { Turma } from '../types';
import { BRAND, TURMA_COLORS, sortOptionLabels } from './colors';

const NAVY = BRAND.navy.replace('#', '');
const SLIDE_W = 13.33;

function addFooterRates(slide: pptxgen.Slide, turmas: Turma[]) {
  const positions: [number, 'left' | 'right'][] = [[0.3, 'left'], [SLIDE_W - 5.3, 'right']];
  turmas.slice(0, 2).forEach((t, i) => {
    slide.addText(`${t.nome} = ${t.respondentes} / ${Math.round(t.taxaResposta)}% (${t.mesAvaliacao})`, {
      x: positions[i][0],
      y: 6.9,
      w: 5,
      h: 0.4,
      fontSize: 14,
      bold: true,
      color: NAVY,
      align: positions[i][1] === 'left' ? 'left' : 'right',
    });
  });
}

function coverSlide(pptx: pptxgen) {
  const slide = pptx.addSlide();
  slide.addText('Avaliação Institucional', {
    x: 0,
    y: 3,
    w: SLIDE_W,
    h: 1,
    align: 'center',
    fontSize: 32,
    bold: true,
    color: NAVY,
  });
}

function summarySlide(pptx: pptxgen, turmas: Turma[]) {
  const slide = pptx.addSlide();
  const colWidth = SLIDE_W / turmas.length;
  turmas.forEach((t, i) => {
    const x = i * colWidth + 0.5;
    slide.addText(t.nome, { x, y: 0.6, w: colWidth - 1, h: 0.5, bold: true, fontSize: 18, color: NAVY });
    slide.addText(`${t.inicio}  →  ${t.fim}`, { x, y: 1.2, w: colWidth - 1, h: 0.4, fontSize: 14, color: BRAND.blue.replace('#',''), bold: true });
    const lines = [
      `AVALIAÇÃO: ${t.mesAvaliacao}`,
      `INÍCIO: ${t.qtdIniciaram}`,
      `SAÍDA: ${t.qtdEvadidos}`,
      `TRANSFERÊNCIA: ${t.qtdTransferidos}`,
      `EVASÃO: ${Math.round(t.percEvasao)}%`,
      `INAD.: ${Math.round(t.percInadimplencia)}%`,
      `ATIVOS: ${t.ativos}`,
    ];
    slide.addText(lines.join('\n'), { x, y: 1.8, w: colWidth - 1, h: 2.5, fontSize: 14, color: '000000', lineSpacingMultiple: 1.4 });
  });
}

function objectiveSlide(pptx: pptxgen, questionText: string, key: string, turmas: Turma[]) {
  const relevant = turmas.filter((t) => t.questions.some((q) => q.key === key && q.type === 'objetiva'));
  if (relevant.length === 0) return;

  const slide = pptx.addSlide();
  slide.addText(questionText, { x: 0.4, y: 0.3, w: SLIDE_W - 0.8, h: 0.8, fontSize: 20, bold: true, color: NAVY });

  const labelSet = new Set<string>();
  relevant.forEach((t) => {
    const q = t.questions.find((qq) => qq.key === key);
    q?.options?.forEach((o) => labelSet.add(o.label));
  });
  const labels = sortOptionLabels(Array.from(labelSet));

  const chartData = relevant.map((t, idx) => {
    const q = t.questions.find((qq) => qq.key === key);
    const total = q?.options?.reduce((s, o) => s + o.count, 0) ?? 0;
    const values = labels.map((label) => {
      const opt = q?.options?.find((o) => o.label === label);
      return opt && total > 0 ? Math.round((opt.count / total) * 1000) / 10 : 0;
    });
    return {
      name: t.nome,
      labels,
      values,
      color: TURMA_COLORS[idx % TURMA_COLORS.length],
    };
  });

  slide.addChart(
    pptx.ChartType.bar,
    chartData.map((d) => ({ name: d.name, labels: d.labels, values: d.values })),
    {
      x: 1,
      y: 1.2,
      w: SLIDE_W - 2,
      h: 5.3,
      barDir: 'col',
      barGrouping: 'clustered',
      showLegend: true,
      legendPos: 'b',
      showValue: true,
      dataLabelPosition: 'outEnd',
      dataLabelFormatCode: '0"%"',
      catAxisLabelColor: '000000',
      chartColors: chartData.map((d) => d.color),
      valAxisLabelFormatCode: '0"%"',
    }
  );

  addFooterRates(slide, relevant);
}

function openSlides(pptx: pptxgen, questionText: string, key: string, turmas: Turma[]) {
  const ROWS_PER_SLIDE = 12;
  turmas.forEach((t) => {
    const q = t.questions.find((qq) => qq.key === key && qq.type === 'aberta');
    const answers = q?.answers ?? [];
    if (answers.length === 0) return;

    for (let i = 0; i < answers.length; i += ROWS_PER_SLIDE) {
      const chunk = answers.slice(i, i + ROWS_PER_SLIDE);
      const slide = pptx.addSlide();
      slide.addText(
        [
          { text: `${questionText}\n`, options: { fontSize: 18, bold: true, color: NAVY } },
          { text: t.nome, options: { fontSize: 14, bold: true, color: BRAND.blue.replace('#','') } },
        ],
        { x: 0.4, y: 0.3, w: SLIDE_W - 0.8, h: 0.9 }
      );

      const rows = chunk.map((answer) => [
        { text: answer, options: { fontSize: 12, color: '000000', align: 'left' as const } },
      ]);

      slide.addTable(rows, {
        x: 0.4,
        y: 1.3,
        w: SLIDE_W - 0.8,
        h: 5.5,
        border: { type: 'none' },
        fill: { color: 'FFFFFF' },
        autoPage: false,
        valign: 'middle',
      });
    }
  });
}

export function exportToPptx(turmas: Turma[]) {
  const pptx = new pptxgen();
  pptx.defineLayout({ name: 'WIDE', width: SLIDE_W, height: 7.5 });
  pptx.layout = 'WIDE';

  coverSlide(pptx);
  summarySlide(pptx, turmas);

  const seen = new Set<string>();
  turmas.forEach((t) => {
    t.questions.forEach((q) => {
      if (seen.has(q.key)) return;
      seen.add(q.key);
      if (q.type === 'objetiva') {
        objectiveSlide(pptx, q.text, q.key, turmas);
      } else {
        openSlides(pptx, q.text, q.key, turmas);
      }
    });
  });

  pptx.writeFile({ fileName: 'Avaliacao_Institucional_Tabulacao.pptx' });
}
