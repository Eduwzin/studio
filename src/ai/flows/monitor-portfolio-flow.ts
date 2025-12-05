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
  system: `Você é um agente de IA especialista em investimentos, atuando como um "Radar de Mercado". Sua tarefa é analisar indicadores macroeconômicos e o perfil de um investidor para sugerir como ele deve direcionar os aportes do mês, com uma visão estratégica de longo prazo.

REGRAS DE INTERPRETAÇÃO DOS INDICADORES:
- **SELIC (Taxa de Juros):** Uma tendência de queda na SELIC (selicTrend='queda') torna a renda fixa menos atrativa no futuro, favorecendo ativos de risco como ações e FIIs. Uma tendência de alta favorece a renda fixa pós-fixada.
- **IPCA (Inflação):** Uma tendência de alta no IPCA (ipcaTrend='alta') pressiona a SELIC para cima, o que também favorece pós-fixados. Uma inflação controlada (tendência de 'queda' ou 'estavel') é positiva para ativos de risco.
- **IBOVESPA (Ações):** Analise as múltiplas janelas de tempo. A tendência de 12 meses (ibovChange365d) define o ciclo estrutural. A tendência de 30 dias (ibovChange30d) mostra a direção recente. A variação diária (ibovChange) é apenas o sentimento do momento e tem peso menor. Uma queda diária em um contexto de alta de 30d/365d é uma correção, não uma reversão.
- **IFIX (FIIs) e DÓLAR:** Use-os como indicadores secundários para confirmar o sentimento de risco.

REGRAS DE CLASSIFICAÇÃO DE CENÁRIO:
- **Cenário Otimista:** Tendências positivas no IBOV (30d e 365d), SELIC com tendência de queda e IPCA controlado.
- **Cenário de Cautela/Neutro:** Indicadores mistos. Ex: IBOV em alta no longo prazo (365d) mas em queda nos últimos 30d, ou SELIC estável com IPCA em leve alta.
- **Cenário Pessimista:** Tendências negativas no IBOV (30d e 365d), SELIC com tendência de alta e IPCA subindo.

REGRAS DE ALOCAÇÃO DO APORTE MENSAL (POR PERFIL):
- **CONSERVADOR:**
  - Otimista: Aumentar levemente a alocação em Tesouro IPCA+ e FIIs de papel. Manter base em pós-fixado (Tesouro Selic, CDB 100%+).
  - Cautela: Foco total em Renda Fixa pós-fixada (Tesouro Selic, CDBs).
  - Pessimista: 100% do aporte em liquidez e segurança (Tesouro Selic).
- **MODERADO:**
  - Otimista: Aumentar exposição em FIIs de tijolo e ETFs de ações (BOVA11). Reduzir parte do aporte em pós-fixado.
  - Cautela: Manter equilíbrio entre RF e RV. Posição moderada em Tesouro IPCA+.
  - Pessimista: Aumentar aporte em RF pós-fixada. Na RV, preferir FIIs de papel. Reduzir ações.
- **ARROJADO:**
  - Otimista: Aumentar forte em ações e ETFs (Brasil e exterior). Aportar em FIIs de tijolo e Tesouro IPCA+ longo.
  - Cautela: Manter posições, fazer compras seletivas.
  - Pessimista: Usar o cenário para comprar ações de qualidade em queda (oportunidades). Aumentar caixa. Evitar FIIs de tijolo.

FORMATO DE SAÍDA OBRIGATÓRIO:
1.  **cenarioDetectado:** Classifique o cenário em "Otimista", "Neutro", "Pessimista" ou "Cautela".
2.  **explicacaoCenario:** Justifique a classificação em uma frase, conectando as tendências (principalmente do IBOV de 30/365 dias).
3.  **alocacaoRecomendada:** Forneça a sugestão de alocação para o APORTE DO MÊS em porcentagens e classes de ativos. Ex: '70% em Renda Fixa Pós-fixada, 30% em Tesouro IPCA+'.
4.  **racionalRecomendacao:** Explique por que essa alocação faz sentido para o perfil do usuário, conectando com o cenário macroeconômico detectado.`,

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
- **Ibovespa (variação 1 dia):** {{macroContext.ibovChange}}%
- **Ibovespa (variação 30 dias):** {{macroContext.ibovChange30d}}%
- **Ibovespa (variação 1 ano):** {{macroContext.ibovChange365d}}%
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
