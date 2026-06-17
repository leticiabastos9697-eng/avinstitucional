import { useState } from 'react';
import BrandHeader from './components/BrandHeader';
import ImportStep from './components/ImportStep';
import ClassInfoForm from './components/ClassInfoForm';
import Dashboard from './components/Dashboard';
import type { ParsedQuestion, Turma, TurmaInfo } from './types';
import { calcAtivos, calcTaxaResposta } from './lib/calc';
import { exportToPptx } from './lib/exportPptx';
import './App.css';

type Step = 'import' | 'form' | 'dashboard';

const STEP_INDEX: Record<Step, number> = { import: 0, form: 1, dashboard: 2 };

export default function App() {
  const [step, setStep] = useState<Step>('import');
  const [pending, setPending] = useState<{ respondentes: number; questions: ParsedQuestion[] } | null>(null);
  const [turmas, setTurmas] = useState<Turma[]>([]);

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
        />
      )}
      </main>
    </div>
  );
}
