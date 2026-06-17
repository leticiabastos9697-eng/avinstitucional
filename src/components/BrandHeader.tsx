interface Props {
  step: number;
}

const STEPS = ['Importar respostas', 'Dados da turma', 'Resultados'];

export default function BrandHeader({ step }: Props) {
  return (
    <header className="brand-header">
      <svg
        className="brand-header__wave"
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,160 C320,40 720,260 1080,120 C1260,55 1380,80 1440,110 L1440,220 L0,220 Z"
          fill="rgba(228,101,14,0.18)"
        />
        <path
          d="M0,190 C300,90 760,220 1100,90 C1260,30 1380,55 1440,80 L1440,220 L0,220 Z"
          fill="rgba(228,101,14,0.35)"
        />
      </svg>

      <div className="brand-header__content">
        <div className="brand-header__brand">
          <span className="brand-header__logo">
            <img src="/ganep-logo.svg" alt="GANEP educação" width="28" height="28" />
          </span>
          <span className="brand-header__wordmark">GANEP <strong>educação</strong></span>
        </div>

        <h1>Tabulação de Avaliação Institucional</h1>
        <p className="brand-header__subtitle">
          Importe as respostas, complete os dados da turma e gere o painel de resultados.
        </p>

        <ol className="step-indicator">
          {STEPS.map((label, i) => (
            <li
              key={label}
              className={
                i === step ? 'is-current' : i < step ? 'is-done' : ''
              }
            >
              <span className="step-indicator__dot">{i < step ? '✓' : i + 1}</span>
              <span className="step-indicator__label">{label}</span>
            </li>
          ))}
        </ol>
      </div>
    </header>
  );
}
