'use server';
/**
 * @fileOverview Este arquivo define um fluxo Genkit para analisar o perfil, a tolerância ao risco e as metas financeiras de um usuário para criar uma estratégia de investimento personalizada.
 *
 * - analyzeUserProfile - Uma função que aciona o fluxo de análise do perfil do usuário.
 * - AnalyzeUserProfileInput - O tipo de entrada para a função analyzeUserProfile.
 * - AnalyzeUserProfileOutput - O tipo de saída para a função analyzeUserProfile.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeUserProfileInputSchema = z.object({
  age: z.number().describe('A idade do usuário.'),
  riskTolerance: z
    .string()
    .describe(
      'A tolerância ao risco do usuário (por exemplo, baixa, média, alta). Deve ser uma das seguintes strings: baixa, média, alta.'
    ),
  financialGoals: z
    .string()
    .describe(
      'As metas financeiras do usuário (por exemplo, aposentadoria, comprar uma casa, economizar para educação).'
    ),
  investmentExperience: z
    .string()
    .describe(
      'A experiência de investimento do usuário (por exemplo, nenhuma, iniciante, intermediária, especialista). Deve ser uma das seguintes strings: nenhuma, iniciante, intermediária, especialista.'
    ),
  income: z.number().describe('A renda anual do usuário.'),
  investmentAmount: z.number().describe('O valor total que o usuário deseja investir.'),
});
export type AnalyzeUserProfileInput = z.infer<typeof AnalyzeUserProfileInputSchema>;

const AnalyzeUserProfileOutputSchema = z.object({
  investmentStrategy: z
    .string()
    .describe('Uma estratégia de investimento personalizada e adaptada ao usuário.'),
  assetAllocation: z
    .string()
    .describe(
      'A alocação de ativos recomendada com base na análise do perfil do usuário (por exemplo, ações, títulos, imóveis).'
    ),
  riskAssessment: z
    .string()
    .describe('Uma avaliação do perfil de risco do usuário com base nos dados fornecidos.'),
});
export type AnalyzeUserProfileOutput = z.infer<typeof AnalyzeUserProfileOutputSchema>;

export async function analyzeUserProfile(input: AnalyzeUserProfileInput): Promise<AnalyzeUserProfileOutput> {
  return analyzeUserProfileFlow(input);
}

const analyzeUserProfilePrompt = ai.definePrompt({
  name: 'analyzeUserProfilePrompt',
  input: {schema: AnalyzeUserProfileInputSchema},
  output: {schema: AnalyzeUserProfileOutputSchema},
  prompt: `Você é um consultor de investimentos especialista. Analise o perfil do usuário e forneça uma estratégia de investimento personalizada, alocação de ativos recomendada e uma avaliação de risco.

Perfil do Usuário:
- Idade: {{{age}}}
- Tolerância ao Risco: {{{riskTolerance}}}
- Metas Financeiras: {{{financialGoals}}}
- Experiência de Investimento: {{{investmentExperience}}}
- Renda: {{{income}}}
- Valor do Investimento: {{{investmentAmount}}}

Com base nessas informações, forneça o seguinte:

Estratégia de Investimento: Uma estratégia de investimento detalhada, adaptada às necessidades и metas do usuário.
Alocação de Ativos: Uma alocação de ativos recomendada em porcentagem entre diferentes classes de ativos.
Avaliação de Risco: Uma avaliação de risco do perfil do usuário com base nos dados fornecidos.

Faça a estratégia de investimento e a alocação de ativos apropriadas para um investidor iniciante.`,
});

const analyzeUserProfileFlow = ai.defineFlow(
  {
    name: 'analyzeUserProfileFlow',
    inputSchema: AnalyzeUserProfileInputSchema,
    outputSchema: AnalyzeUserProfileOutputSchema,
  },
  async input => {
    const {output} = await analyzeUserProfilePrompt(input);
    return output!;
  }
);
