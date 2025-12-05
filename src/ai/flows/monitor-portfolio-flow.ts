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

// Esquema de saída, focado na alocação do aporte mensal
const MonitorPortfolioOutputSchema = z.object({
  cenarioDetectado: z.enum(["Otimista", "Neutro", "Pessimista", "Cautela"]).describe("O cenário macroeconômico detectado pela IA."),
  explicacaoCenario: z.string().describe("Uma explicação curta e direta do porquê o cenário foi classificado dessa forma, baseado nos indicadores."),
  alocacaoRecomendada: z.string().describe("A sugestão de alocação do aporte mensal em porcentagens e classes de ativos. Ex: '70% em Renda Fixa Pós-fixada, 30% em Tesouro IPCA+'"),
  racionalRecomendacao: z.string().describe("A justificativa para a alocação recomendada, conectando os dados macro ao perfil do investidor."),
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
  system: `Você é um agente de IA especialista em investimentos, atuando como um "Radar de Mercado". Sua tarefa é analisar indicadores macroeconômicos e o perfil de um investidor para sugerir como ele deve direcionar os aportes do mês.

REGRAS DE INTERPRETAÇÃO:
- Selic (tendência de queda): Renda fixa perde atratividade futura, ativos de risco (ações, FIIs) ganham espaço.
- IPCA (tendência de alta): Pressiona a Selic para cima, favorece pós-fixados e prejudica FIIs de tijolo.
- IFIX (positivo): Otimismo e fluxo entrando em FIIs.
- IBOV (positivo): Apetite geral ao risco no mercado de ações.
- Dólar (alto): Aumento do risco-país, pode prejudicar a bolsa.

REGRAS DE CENÁRIO:
- Cenário Otimista: Selic com tendência de queda, IPCA controlado (queda/estável), IBOV e IFIX positivos, Dólar estável ou em queda.
- Cenário Neutro/Cautela: Indicadores mistos, como Selic estável, mas IPCA com leve alta.
- Cenário Pessimista: Selic com tendência de alta, IPCA subindo, IBOV e IFIX negativos, Dólar em alta.

REGRAS DE ALOCAÇÃO POR PERFIL (para o aporte do mês):
- CONSERVADOR:
  - Otimista: Aumentar levemente a alocação em Tesouro IPCA+ e FIIs de papel. Manter base em pós-fixado (Tesouro Selic, CDB 100%+).
  - Neutro/Cautela: Foco total em Renda Fixa pós-fixada (Tesouro Selic, CDBs).
  - Pessimista: 100% do aporte em liquidez e segurança (Tesouro Selic).
- MODERADO:
  - Otimista: Aumentar exposição em FIIs de tijolo e ETFs de ações (BOVA11). Reduzir parte do aporte em pós-fixado.
  - Neutro/Cautela: Manter equilíbrio entre RF e RV. Posição moderada em Tesouro IPCA+.
  - Pessimista: Aumentar aporte em RF pós-fixada. Na RV, preferir FIIs de papel. Reduzir ações.
- ARROJADO:
  - Otimista: Aumentar forte em ações e ETFs (Brasil e exterior). Aportar em FIIs de tijolo e Tesouro IPCA+ longo.
  - Neutro/Cautela: Manter posições, fazer compras seletivas.
  - Pessimista: Usar o cenário para comprar ações de qualidade em queda (oportunidades). Aumentar caixa. Evitar FIIs de tijolo.

FORMATO DE SAÍDA OBRIGATÓRIO:
1. cenarioDetectado: Classifique o cenário em "Otimista", "Neutro", "Pessimista" ou "Cautela".
2. explicacaoCenario: Justifique a classificação em uma frase.
3. alocacaoRecomendada: Forneça a sugestão de alocação para o APORTE DO MÊS em porcentagens e classes de ativos.
4. racionalRecomendacao: Explique por que essa alocação faz sentido para o perfil do usuário, conectando com o cenário.`,

  prompt: `
Analise os seguintes dados e gere a recomendação de aporte para o investidor.

### 1. Perfil do Investidor
- **Perfil de Risco:** {{userProfile.riskProfile}}
- **Horizonte de Tempo:** {{userProfile.investmentHorizon}}
- **Tolerância ao Risco:** {{userProfile.riskTolerance}}

### 2. Contexto Macroeconômico Atual
- **Taxa Selic:** {{macroContext.selicRate}}% (tendência: {{macroContext.selicTrend}})
- **Inflação (IPCA 12m):** {{macroContext.ipca12m}}% (tendência: {{macroContext.ipcaTrend}})
- **IFIX (variação dia):** {{macroContext.ifixChange}}%
- **Ibovespa (variação dia):** {{macroContext.ibovChange}}%
- **Dólar (USD/BRL):** R$ {{macroContext.dollarRate}}

Agora, gere a análise completa no formato de saída solicitado.
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
