'use server';
/**
 * @fileOverview Este arquivo define um fluxo Genkit que atua como um "Radar de Mercado".
 * Ele analisa o cenário macroeconômico atual junto com o perfil do investidor
 * para fornecer recomendações de manutenção e ajuste de portfólio.
 *
 * - monitorPortfolio: A função principal que executa o fluxo de análise.
 * - MonitorPortfolioInput: O tipo de entrada para a função, contendo o perfil do usuário e o contexto macro.
 * - MonitorPortfolioOutput: O tipo de saída, estruturado em quatro blocos claros de recomendação.
 */

import { ai } from '@/ai/genkit';
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
  ibovChange: z.number().describe("A variação recente do Ibovespa (percentual)."),
  dollarRate: z.number().describe("A cotação atual do dólar (USD/BRL)."),
  marketSentiment: z.enum(["otimista", "neutro", "pessimista"]).describe("O sentimento geral do mercado."),
});

// Esquema de entrada para o fluxo
const MonitorPortfolioInputSchema = z.object({
  userProfile: UserProfileSchema,
  macroContext: MacroContextSchema,
});
export type MonitorPortfolioInput = z.infer<typeof MonitorPortfolioInputSchema>;

// Esquema de saída, seguindo o formato de 4 blocos solicitado
const MonitorPortfolioOutputSchema = z.object({
  scenarioAnalysis: z.string().describe("Bloco 1: Uma leitura simples do cenário atual, explicando se o ambiente favorece renda fixa ou variável, o impacto dos juros nos FIIs, etc."),
  userProfileImpact: z.string().describe("Bloco 2: Uma análise de como o cenário atual afeta especificamente o perfil de risco do usuário (conservador, moderado ou agressivo)."),
  recommendedNextSteps: z.string().describe("Bloco 3: Ações práticas e direcionais que o investidor deve considerar (ex: 'reforçar posição em...', 'aumentar gradualmente a parcela em...')."),
  recommendationRationale: z.string().describe("Bloco 4: Uma justificativa simples e didática para as recomendações fornecidas, conectando-as ao cenário macroeconômico."),
});
export type MonitorPortfolioOutput = z.infer<typeof MonitorPortfolioOutputSchema>;

// Função exportada que os componentes do Next.js chamarão
export async function monitorPortfolio(input: MonitorPortfolioInput): Promise<MonitorPortfolioOutput> {
  return monitorPortfolioFlow(input);
}

// Definição do prompt para a IA
const monitorPrompt = ai.definePrompt({
  name: 'monitorPortfolioPrompt',
  input: { schema: MonitorPortfolioInputSchema },
  output: { schema: MonitorPortfolioOutputSchema },
  system: `Você é um agente de inteligência artificial especializado em investimentos, macroeconomia e gestão dinâmica de portfólio. Seu papel é atuar como um "radar de mercado", analisando o cenário econômico e indicando os próximos passos que o investidor deve considerar para manter sua carteira saudável.

## Sua Missão
Com base no perfil do investidor e no contexto macroeconômico fornecido, gere orientações personalizadas para ajudar o investidor a manter sua carteira saudável.

## Regras de Conduta
- NÃO recomende ativos ou tickers específicos (ex: PETR4). Fale apenas de classes de ativos (ex: "ações de grandes empresas", "FIIs de tijolo").
- NÃO forneça percentuais exatos de alocação. Use apenas direções como "aumentar", "reduzir", "priorizar", "manter", "ter cautela".
- Use linguagem simples, objetiva e didática.
- Adapte a agressividade da recomendação ao perfil do investidor (conservador, moderado, agressivo).
- Baseie TODAS as suas conclusões estritamente nos dados de entrada fornecidos.

## Formato de Saída Obrigatório
Responda SEMPRE usando a estrutura de 4 blocos definida no esquema de saída.`,

  prompt: `
Analise os seguintes dados e gere as recomendações para o investidor.

### 1. Perfil do Investidor
- **Perfil de Risco:** {{userProfile.riskProfile}}
- **Horizonte de Tempo:** {{userProfile.investmentHorizon}}
- **Tolerância ao Risco:** {{userProfile.riskTolerance}}

### 2. Contexto Macroeconômico Atual
- **Taxa Selic:** {{macroContext.selicRate}}% (tendência: {{macroContext.selicTrend}})
- **Inflação (IPCA 12m):** {{macroContext.ipca12m}}% (tendência: {{macroContext.ipcaTrend}})
- **IFIX (variação recente):** {{macroContext.ifixChange}}%
- **Ibovespa (variação recente):** {{macroContext.ibovChange}}%
- **Dólar (USD/BRL):** R$ {{macroContext.dollarRate}}
- **Sentimento de Mercado:** {{macroContext.marketSentiment}}

Agora, gere a análise completa no formato de 4 blocos solicitado.
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
