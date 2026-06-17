import { useEffect, useState } from 'react';
import BrandHeader from './components/BrandHeader';
import ImportStep from './components/ImportStep';
import ClassInfoForm from './components/ClassInfoForm';
import Dashboard from './components/Dashboard';
import type { ParsedQuestion, Turma, TurmaInfo } from './types';
import { calcAtivos, calcTaxaResposta } from './lib/calc';
import { exportToPptx } from './lib/exportPptx';
import { loadTurmas, saveTurmas } from './lib/storage';
import './App.css';

type Step = 'import' | 'form' | 'dashboard';

const STEP_INDEX: Record<Step, number> = { import: 0, form: 1, dashboard: 2 };

export default function App() {
  const [turmas, setTurmas] = useState<Turma[]>(() => loadTurmas());
  const [step, setStep] = useState<Step>(() => (loadTurmas().length > 0 ? 'dashboard' : 'import'));
  const [pending, setPending] = useState<{ respondentes: number; questions: ParsedQuestion[] } | null>(null);

  useEffect(() => {
    saveTurmas(turmas);
  }, [turmas]);

  function handleParsed(data: { respondentes: number; questions: ParsedQuestion[]; fileName: string }) {
    setPending({ respondentes: data.respondentes, questions: data.questions });
    setStep('form');
  }

  function handleInfoSubmit(info: TurmaInfo) {
    if (!pending) return;
    const ativos = calcAtivos(info);
    const taxaResposta = calcTaxaResposta(pending.respondentes, ativos);
    const turma: Turma = {
      ...info,
      id: crypto.randomUUID(),
      respondentes: pending.respondentes,
      ativos,
      taxaResposta,
      questions: pending.questions,
    };
    setTurmas((prev) => [...prev, turma]);
    setPending(null);
    setStep('dashboard');
  }

  function handleDeleteTurma(id: string) {
    setTurmas((prev) => {
      const next = prev.filter((t) => t.id !== id);
      if (next.length === 0) setStep('import');
      return next;
    });
  }

  return (
    <div className="app">
      <BrandHeader step={STEP_INDEX[step]} />

      <main className="app-main">
      {step === 'import' && <ImportStep onParsed={handleParsed} />}

      {step === 'form' && pending && (
        <ClassInfoForm
          respondentes={pending.respondentes}
          onSubmit={handleInfoSubmit}
          onCancel={() => {
            setPending(null);
            setStep(turmas.length > 0 ? 'dashboard' : 'import');
          }}
        />
      )}

      {step === 'dashboard' && turmas.length > 0 && (
        <Dashboard
          turmas={turmas}
          onExport={exportToPptx}
          onAddTurma={() => setStep('import')}
          onDeleteTurma={handleDeleteTurma}
        />
      )}
      </main>
    </div>
  );
}
