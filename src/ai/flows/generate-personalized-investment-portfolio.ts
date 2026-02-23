'use server';
/**
 * @fileOverview Gera um portfólio de investimentos personalizado com base na análise do perfil do usuário.
 *
 * - generatePersonalizedInvestmentPortfolio - Uma função que gera o portfólio.
 * - GeneratePersonalizedInvestmentPortfolioInput - O tipo de entrada para a função generatePersonalizedInvestmentPortfolio.
 * - GeneratePersonalizedInvestmentPortfolioOutput - O tipo de retorno para a função generatePersonalizedInvestmentPortfolio.
 */

import {ai, geminiModel} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedInvestmentPortfolioInputSchema = z.object({
  userProfile: z
    .string()
    .describe("Uma análise detalhada do perfil de investimento do usuário, incluindo tolerância ao risco, metas financeiras e experiência de investimento."),
});
export type GeneratePersonalizedInvestmentPortfolioInput = z.infer<
  typeof GeneratePersonalizedInvestmentPortfolioInputSchema
>;

const GeneratePersonalizedInvestmentPortfolioOutputSchema = z.object({
  portfolioAllocation: z.string().describe('Uma alocação de portfólio de investimentos personalizada, incluindo classes de ativos e porcentagens específicas.'),
  recommendationSummary: z.string().describe('Um resumo do motivo pelo qual este portfólio foi recomendado e como ele se alinha com o perfil do usuário.'),
});

export type GeneratePersonalizedInvestmentPortfolioOutput = z.infer<
  typeof GeneratePersonalizedInvestmentPortfolioOutputSchema
>;

export async function generatePersonalizedInvestmentPortfolio(
  input: GeneratePersonalizedInvestmentPortfolioInput
): Promise<GeneratePersonalizedInvestmentPortfolioOutput> {
  return generatePersonalizedInvestmentPortfolioFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedInvestmentPortfolioPrompt',
  model: geminiModel,
  input: {schema: GeneratePersonalizedInvestmentPortfolioInputSchema},
  output: {schema: GeneratePersonalizedInvestmentPortfolioOutputSchema},
  prompt: `Você é um consultor financeiro especialista. Dada a seguinte análise de perfil de usuário, crie uma alocação de portfólio de investimentos personalizada.

Análise do Perfil do Usuário: {{{userProfile}}}

Considere a tolerância ao risco, as metas financeiras e a experiência de investimento do usuário ao determinar a alocação de ativos apropriada. Forneça um resumo do motivo pelo qual você recomendou este portfólio e como ele se alinha com o perfil do usuário.

Formate a alocação do portfólio como uma lista de classes de ativos e suas porcentagens correspondentes.
`,
});

const generatePersonalizedInvestmentPortfolioFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedInvestmentPortfolioFlow',
    inputSchema: GeneratePersonalizedInvestmentPortfolioInputSchema,
    outputSchema: GeneratePersonalizedInvestmentPortfolioOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
