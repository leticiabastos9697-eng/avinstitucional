# Tabulação de Avaliação Institucional

Aplicação web para automatizar a tabulação da Avaliação Institucional, reproduzindo
fielmente o modelo de apresentação utilizado atualmente.

## Fluxo

1. Importe o arquivo XLSX/CSV exportado do Google Forms.
2. Preencha os dados complementares da turma (nome, datas, evasão, inadimplência etc.).
3. O sistema calcula automaticamente Alunos Ativos e Taxa de Resposta, classifica
   cada pergunta como objetiva ou aberta, e monta o painel de resultados (gráficos
   para perguntas objetivas, listas para perguntas abertas).
4. Repita para outras turmas para comparação lado a lado.
5. Exporte para PowerPoint (.pptx) com gráficos nativos editáveis, seguindo a mesma
   organização da apresentação atual (capa, resumo de turma, pergunta por pergunta).

## Desenvolvimento

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
