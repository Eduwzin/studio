'use server';

/**
 * @fileOverview Simula o desempenho de um portfólio ao longo do tempo usando IA, incorporando dados prospectivos e sugerindo melhorias.
 *
 * - simulatePortfolioPerformance - Uma função que lida com a simulação de desempenho do portfólio.
 * - SimulatePortfolioPerformanceInput - O tipo de entrada para a função simulatePortfolioPerformance.
 * - SimulatePortfolioPerformanceOutput - O tipo de retorno para a função simulatePortfolioPerformance.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulatePortfolioPerformanceInputSchema = z.object({
  portfolioDescription: z
    .string()
    .describe('Uma descrição detalhada do portfólio de investimentos atual, incluindo alocação de ativos e desempenho histórico.'),
  marketConditions: z
    .string()
    .describe('Um resumo das condições atuais do mercado e previsões econômicas.'),
  investmentGoals: z
    .string()
    .describe('As metas de investimento do usuário, tolerância ao risco e horizonte de tempo.'),
});
export type SimulatePortfolioPerformanceInput = z.infer<
  typeof SimulatePortfolioPerformanceInputSchema
>;

const SimulatePortfolioPerformanceOutputSchema = z.object({
  projectedPerformance: z
    .string()
    .describe('Uma projeção detalhada do desempenho do portfólio ao longo do horizonte de tempo especificado, incluindo crescimento potencial e riscos.'),
  suggestedImprovements: z
    .string()
    .describe(
      'Recomendações específicas para melhorar o desempenho do portfólio, como rebalanceamento da alocação de ativos ou ajuste de estratégias de investimento.'
    ),
  riskAnalysis: z
    .string()
    .describe('Uma análise da exposição ao risco do portfólio e potenciais estratégias de mitigação.'),
});
export type SimulatePortfolioPerformanceOutput = z.infer<
  typeof SimulatePortfolioPerformanceOutputSchema
>;

export async function simulatePortfolioPerformance(
  input: SimulatePortfolioPerformanceInput
): Promise<SimulatePortfolioPerformanceOutput> {
  return simulatePortfolioPerformanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'simulatePortfolioPerformancePrompt',
  input: {schema: SimulatePortfolioPerformanceInputSchema},
  output: {schema: SimulatePortfolioPerformanceOutputSchema},
  prompt: `Você é um consultor de investimentos de IA encarregado de simular o desempenho do portfólio de investimentos de um usuário ao longo do tempo.

  Com base na descrição do portfólio fornecida, nas condições atuais do mercado e nas metas de investimento do usuário, forneça uma projeção detalhada do desempenho do portfólio, juntamente com melhorias sugeridas e uma análise de risco.

  Descrição do Portfólio: {{{portfolioDescription}}}
  Condições de Mercado: {{{marketConditions}}}
  Metas de Investimento: {{{investmentGoals}}}

  Concentre-se em fornecer insights acionáveis que o usuário possa usar para tomar decisões informadas sobre sua estratégia de investimento.
  Siga o esquema para produzir a saída.
  `,
});

const simulatePortfolioPerformanceFlow = ai.defineFlow(
  {
    name: 'simulatePortfolioPerformanceFlow',
    inputSchema: SimulatePortfolioPerformanceInputSchema,
    outputSchema: SimulatePortfolioPerformanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
