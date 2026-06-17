import { useState } from 'react';
import type { TurmaInfo } from '../types';

interface Props {
  respondentes: number;
  onSubmit: (info: TurmaInfo) => void;
  onCancel: () => void;
}

const empty: TurmaInfo = {
  nome: '',
  inicio: '',
  fim: '',
  qtdIniciaram: 0,
  qtdEvadidos: 0,
  qtdTransferidos: 0,
  percEvasao: 0,
  percInadimplencia: 0,
};

export default function ClassInfoForm({ respondentes, onSubmit, onCancel }: Props) {
  const [info, setInfo] = useState<TurmaInfo>(empty);

  function update<K extends keyof TurmaInfo>(key: K, value: TurmaInfo[K]) {
    setInfo((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(info);
  }

  return (
    <div className="card">
      <h2>2. Dados complementares da turma</h2>
      <p className="muted">{respondentes} respondentes identificados no arquivo importado.</p>
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Nome da Turma
          <input required value={info.nome} onChange={(e) => update('nome', e.target.value)} placeholder="Ex: NCH T04 SEMI SP" />
        </label>
        <label>
          Mês/Ano de Início
          <input required value={info.inicio} onChange={(e) => update('inicio', e.target.value)} placeholder="Ex: AGO/25" />
        </label>
        <label>
          Mês/Ano de Conclusão
          <input required value={info.fim} onChange={(e) => update('fim', e.target.value)} placeholder="Ex: SET/26" />
        </label>
        <label>
          Quantidade de Alunos que Iniciaram
          <input required type="number" min={0} value={info.qtdIniciaram} onChange={(e) => update('qtdIniciaram', Number(e.target.value))} />
        </label>
        <label>
          Quantidade de Alunos Evadidos
          <input required type="number" min={0} value={info.qtdEvadidos} onChange={(e) => update('qtdEvadidos', Number(e.target.value))} />
        </label>
        <label>
          Quantidade de Alunos Transferidos
          <input required type="number" min={0} value={info.qtdTransferidos} onChange={(e) => update('qtdTransferidos', Number(e.target.value))} />
        </label>
        <label>
          Percentual de Evasão
          <input required type="number" min={0} max={100} step="0.1" value={info.percEvasao} onChange={(e) => update('percEvasao', Number(e.target.value))} />
        </label>
        <label>
          Percentual de Inadimplência
          <input required type="number" min={0} max={100} step="0.1" value={info.percInadimplencia} onChange={(e) => update('percInadimplencia', Number(e.target.value))} />
        </label>
        <div className="actions">
          <button type="button" className="secondary" onClick={onCancel}>Cancelar</button>
          <button type="submit">Adicionar turma</button>
        </div>
      </form>
    </div>
  );
}
