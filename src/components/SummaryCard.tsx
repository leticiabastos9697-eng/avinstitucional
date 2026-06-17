import type { Turma } from '../types';
import { formatPercent } from '../lib/calc';

export default function SummaryCard({ turma }: { turma: Turma }) {
  return (
    <div className="summary-card">
      <h3>{turma.nome}</h3>
      <div className="timeline">
        <span>{turma.inicio}</span>
        <span className="arrow">→</span>
        <span>{turma.fim}</span>
      </div>
      <div className="stats">
        <div><span className="label">Início</span><span className="value">{turma.qtdIniciaram}</span></div>
        <div><span className="label">Saída</span><span className="value">{turma.qtdEvadidos}</span></div>
        <div><span className="label">Transferência</span><span className="value">{turma.qtdTransferidos}</span></div>
        <div><span className="label">Evasão</span><span className="value">{formatPercent(turma.percEvasao)}</span></div>
        <div><span className="label">Inad.</span><span className="value">{formatPercent(turma.percInadimplencia)}</span></div>
        <div><span className="label">Ativos</span><span className="value">{turma.ativos}</span></div>
      </div>
      <div className="response-rate">
        {turma.nome} = {turma.respondentes} / {formatPercent(turma.taxaResposta)}
      </div>
    </div>
  );
}
