'use server';

/**
 * @fileOverview Este arquivo define um fluxo Genkit para recomendar os próximos passos de investimento para o portfólio de um usuário.
 *
 * - `recommendNextInvestmentSteps`: Função para orquestrar a recomendação dos próximos passos de investimento.
 * - `RecommendNextInvestmentStepsInput`: Definição do tipo de entrada para a função.
 * - `RecommendNextInvestmentStepsOutput`: Definição do tipo de saída para a função.
 */

import {ai, geminiModel} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendNextInvestmentStepsInputSchema = z.object({
  userProfile: z.string().describe('O perfil do usuário, incluindo tolerância ao risco, metas financeiras e conhecimento de investimento.'),
  currentPortfolio: z.string().describe('O portfólio de investimentos atual do usuário, incluindo alocação de ativos e desempenho.'),
  marketConditions: z.string().describe('Condições e tendências atuais do mercado.'),
});

export type RecommendNextInvestmentStepsInput = z.infer<typeof RecommendNextInvestmentStepsInputSchema>;

const RecommendNextInvestmentStepsOutputSchema = z.object({
  recommendedSteps: z.string().describe('Uma lista dos próximos passos recomendados para o usuário tomar em seu portfólio de investimentos.'),
  rationale: z.string().describe('A justificativa por trás dos passos recomendados, explicando por que são adequados para o usuário.'),
});

export type RecommendNextInvestmentStepsOutput = z.infer<typeof RecommendNextInvestmentStepsOutputSchema>;

export async function recommendNextInvestmentSteps(input: RecommendNextInvestmentStepsInput): Promise<RecommendNextInvestmentStepsOutput> {
  return recommendNextInvestmentStepsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendNextInvestmentStepsPrompt',
  model: geminiModel,
  input: {schema: RecommendNextInvestmentStepsInputSchema},
  output: {schema: RecommendNextInvestmentStepsOutputSchema},
  prompt: `Dado o seguinte perfil de usuário, portfólio atual e condições de mercado, recomende os próximos passos para o portfólio de investimentos do usuário.

Perfil do Usuário: {{{userProfile}}}
Portfólio Atual: {{{currentPortfolio}}}
Condições de Mercado: {{{marketConditions}}}

Considere a tolerância ao risco do usuário, metas financeiras e conhecimento de investimento ao fazer suas recomendações.
Forneça uma justificativa clara para cada passo recomendado.

Garanta que as recomendações sejam acionáveis e forneçam uma direção clara ao usuário.
`, config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const recommendNextInvestmentStepsFlow = ai.defineFlow(
  {
    name: 'recommendNextInvestmentStepsFlow',
    inputSchema: RecommendNextInvestmentStepsInputSchema,
    outputSchema: RecommendNextInvestmentStepsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
