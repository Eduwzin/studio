'use server';
/**
 * @fileOverview Este arquivo define um fluxo Genkit que atua como um "Radar de Mercado".
 * Ele analisa o cenário macroeconômico atual junto com o perfil do investidor
 * para fornecer recomendações de manutenção e ajuste de portfólio.
 *
 * - monitorPortfolio: A função principal que executa o fluxo de análise.
 * - MonitorPortfolioInput: O tipo de entrada para a função, contendo o perfil do usuário e o contexto macro.
 * - MonitorPortfolioOutput: O tipo de saída, estruturado com a recomendação de alocação de aporte.
 */

import { ai, geminiPro } from '@/ai/genkit';
import { z } from 'genkit';

// Esquema para o perfil do investidor
const UserProfileSchema = z.object({
  riskProfile: z.string().describe("O perfil de risco do investidor (conservador, moderado, agressivo)."),
  investmentHorizon: z.string().describe("O horizonte de tempo dos investimentos (curto, médio, longo prazo)."),
  riskTolerance: z.string().describe("A tolerância ao risco declarada pelo usuário."),
});

// Esquema para o contexto macroeconômico
const MacroContextSchema = z.object({
  selicRate: z.number().describe("A taxa Selic meta atual."),
  selicTrend: z.enum(["alta", "queda", "estavel"]).describe("A tendência da taxa Selic."),
  ipca12m: z.number().describe("O valor do IPCA acumulado em 12 meses."),
  ipcaTrend: z.enum(["alta", "queda", "estavel"]).describe("A tendência da inflação (IPCA)."),
  ifixChange: z.number().describe("A variação recente do índice IFIX (percentual)."),
  ibovChange: z.number().describe("A variação diária do Ibovespa (percentual)."),
  ibovChange30d: z.number().describe("A variação do Ibovespa nos últimos 30 dias (percentual)."),
  ibovChange365d: z.number().describe("A variação do Ibovespa nos últimos 365 dias (percentual)."),
  dollarRate: z.number().describe("A cotação atual do dólar (USD/BRL)."),
  marketSentiment: z.enum(["otimista", "neutro", "pessimista"]).describe("O sentimento geral do mercado."),
});

// Esquema de entrada para o fluxo
const MonitorPortfolioInputSchema = z.object({
  userProfile: UserProfileSchema,
  macroContext: MacroContextSchema,
  projectedSelic: z.number().describe("SELIC projetada pelo Focus Anual."),
  projectedIpca: z.number().describe("IPCA projetado pelo Focus para 24 meses."),
});
export type MonitorPortfolioInput = z.infer<typeof MonitorPortfolioInputSchema>;

// Esquema de saída, focado na alocação do aporte mensal
const MonitorPortfolioOutputSchema = z.object({
  cenarioDetectado: z.enum(["Pró-juros altos", "Pró-juros em queda", "Pró-renda variável", "Pró-proteção e renda fixa"]).describe("O cenário macroeconômico classificado pela IA."),
  explicacaoCenario: z.string().describe("Uma explicação curta e direta do porquê o cenário foi classificado dessa forma, baseado nos indicadores."),
  alocacaoRecomendada: z.string().describe("A sugestão de alocação do aporte mensal em porcentagens e classes de ativos, somando 100%. Ex: 'Renda Fixa Pós-fixada: 70%, Tesouro IPCA+: 20%, Ações Brasil: 10%'"),
  racionalRecomendacao: z.string().describe("A justificativa para a alocação recomendada, conectando os dados macro ao perfil do investidor e explicando as decisões."),
});
export type MonitorPortfolioOutput = z.infer<typeof MonitorPortfolioOutputSchema>;


// Função exportada que os componentes do Next.js chamarão
export async function monitorPortfolio(input: MonitorPortfolioInput): Promise<MonitorPortfolioOutput> {
  return monitorPortfolioFlow(input);
}

// Definição do prompt para a IA
const monitorPrompt = ai.definePrompt({
  name: 'monitorPortfolioPrompt',
  model: geminiPro,
  input: { schema: MonitorPortfolioInputSchema },
  output: { schema: MonitorPortfolioOutputSchema },
  system: `Você é um analista de investimentos especialista (CNPI) e sua tarefa é analisar dados macroeconômicos e o perfil de um investidor para gerar uma recomendação completa de alocação de aportes. Siga estritamente as regras abaixo.

# REGRAS DE ANÁLISE E GERAÇÃO DE CARTEIRA

## 1. INTERPRETAÇÃO DA SELIC PROJETADA
- Use a **Selic projetada (Focus Anual)** como referência principal da política monetária.
- **SELIC ALTA OU PROJETADA PARA CIMA**: Priorize pós-fixados, FIIs de papel e menor exposição a ações.
- **SELIC BAIXA OU PROJETADA PARA CAIR**: Priorize ações, FIIs de tijolo e prefixados.

## 2. INTERPRETAÇÃO DO IPCA (REAL + PROJETADO)
- **IPCA REAL > IPCA PROJETADO**: Inflação em queda. Ambiente favorável à renda variável.
- **IPCA REAL < IPCA PROJETADO**: Inflação pressionada. Aumente a alocação em Tesouro IPCA+ e FIIs de papel.

## 3. INTERPRETAÇÃO DO IBOV (12 MESES)
- Extraia a tendência de 12 meses (último fechamento vs. inicial).
- **TENDÊNCIA POSITIVA + SELIC PROJETADA EM QUEDA**: Aumente a alocação em ações.
- **TENDÊNCIA NEGATIVA + SELIC ALTA**: Reduza a alocação em ações.

## 4. INTERPRETAÇÃO DO DÓLAR (120 dias)
- **DÓLAR EM ALTA**: Aumente a proteção internacional e fortaleça a renda fixa.
- **DÓLAR EM QUEDA**: Favorece ações brasileiras e setores cíclicos.

## 5. INTERPRETAÇÃO DO IFIX
- Use como termômetro:
- **IFIX EM ALTA + SELIC EM QUEDA**: FIIs de tijolo ganham espaço.
- **IFIX ESTÁVEL/BAIXA + SELIC ALTA**: FIIs de papel são preferenciais.

## 6. CLASSIFICAÇÃO DO CENÁRIO MACRO
- Combine os 5 pontos acima para classificar o cenário em **UMA** das seguintes categorias:
  - **Pró-juros altos**
  - **Pró-juros em queda**
  - **Pró-renda variável**
  - **Pró-proteção e renda fixa**

## 7. MONTAGEM DA CARTEIRA BASE POR PERFIL
- A carteira deve seguir estas faixas:

### Perfil Conservador
- 70–90% Renda Fixa Pós-fixada
- 5–10% IPCA+
- 0–10% FIIs Papel
- 0–10% Ações

### Perfil Moderado
- 40–60% Renda Fixa (Pós + IPCA+)
- 20–40% Ações
- 10–20% FIIs (Tijolo/Papel conforme cenário)
- Até 10% Internacional

### Perfil Arrojado
- 20–30% Renda Fixa
- 40–70% Ações
- 10–20% FIIs
- 10–20% Internacional

## 8. AJUSTES FINOS CONFORME O CENÁRIO
- Aplique estes ajustes sobre a carteira base do perfil:
- **SELIC PROJETADA > 12%**: Aumente pós-fixados, reduza ações, priorize FIIs de papel.
- **SELIC PROJETADA < 9%**: Aumente ações, aumente FIIs de tijolo, aumente prefixados.
- **IPCA PROJETADO ACIMA DO ATUAL**: Aumente IPCA+, aumente FIIs de papel.
- **IBOV TENDÊNCIA POSITIVA**: Aumente ações (setores cíclicos/crescimento).
- **DÓLAR EM ALTA**: Aumente proteção internacional (ETFs globais).

## 9. FORMATO DA RESPOSTA FINAL
- A resposta DEVE conter:
  1.  **cenarioDetectado**: A classificação do cenário macro (item 6).
  2.  **explicacaoCenario**: Justificativa curta para a classificação.
  3.  **alocacaoRecomendada**: A carteira final em percentuais, **somando exatamente 100%**. Use nomes de classes de ativos claros. Ex: 'Renda Fixa Pós-fixada: 70%, Tesouro IPCA+: 20%, Ações Brasil: 10%'.
  4.  **racionalRecomendacao**: Explicação detalhada de como você combinou o perfil do investidor com o cenário macro e os ajustes finos para chegar a essa alocação.

## 10. VALIDAÇÃO ANTES DE RESPONDER
- Antes de gerar a saída, valide internamente:
  - A carteira é coerente com o perfil? (Não pode ser arriscada para um conservador).
  - A carteira respeita as regras da Selic e do IPCA?
  - A recomendação usa tendências de longo prazo (12 meses) como peso maior, não oscilações do dia.
`,

  prompt: `
Analise os seguintes dados e gere a recomendação de aporte para o investidor.

### 1. Perfil do Investidor
- **Perfil de Risco:** {{userProfile.riskProfile}}
- **Horizonte de Tempo:** {{userProfile.investmentHorizon}}
- **Tolerância ao Risco:** {{userProfile.riskTolerance}}

### 2. Contexto Macroeconômico Atual
- **Taxa Selic Atual:** {{macroContext.selicRate}}%
- **Projeção Selic (Focus Anual):** {{projectedSelic}}%
- **Inflação (IPCA 12m):** {{macroContext.ipca12m}}%
- **Projeção IPCA (Focus 24m):** {{projectedIpca}}%
- **IFIX (variação dia):** {{macroContext.ifixChange}}%
- **Ibovespa (variação 1 dia):** {{macroContext.ibovChange}}%
- **Ibovespa (variação 30 dias):** {{macroContext.ibovChange30d}}%
- **Ibovespa (variação 1 ano):** {{macroContext.ibovChange365d}}%
- **Dólar (USD/BRL):** R$ {{macroContext.dollarRate}}

Agora, gere a análise completa seguindo estritamente todas as regras e o formato de saída obrigatório.
`,
});

// Definição do fluxo Genkit
const monitorPortfolioFlow = ai.defineFlow(
  {
    name: 'monitorPortfolioFlow',
    inputSchema: MonitorPortfolioInputSchema,
    outputSchema: MonitorPortfolioOutputSchema,
  },
  async (input) => {
    const { output } = await monitorPrompt(input);
    if (!output) {
      throw new Error('A IA não conseguiu gerar uma análise para o portfólio.');
    }
    return output;
  }
);
