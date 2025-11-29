'use server';
/**
 * @fileOverview Generates a personalized investment portfolio based on user profile analysis.
 *
 * - generatePersonalizedInvestmentPortfolio - A function that generates the portfolio.
 * - GeneratePersonalizedInvestmentPortfolioInput - The input type for the generatePersonalizedInvestmentPortfolio function.
 * - GeneratePersonalizedInvestmentPortfolioOutput - The return type for the generatePersonalizedInvestmentPortfolio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedInvestmentPortfolioInputSchema = z.object({
  userProfile: z
    .string()
    .describe("A detailed analysis of the user's investment profile, including risk tolerance, financial goals, and investment experience."),
});
export type GeneratePersonalizedInvestmentPortfolioInput = z.infer<
  typeof GeneratePersonalizedInvestmentPortfolioInputSchema
>;

const GeneratePersonalizedInvestmentPortfolioOutputSchema = z.object({
  portfolioAllocation: z.string().describe('A personalized investment portfolio allocation, including specific asset classes and percentages.'),
  recommendationSummary: z.string().describe('A summary of why this portfolio was recommended and how it aligns with the user profile.'),
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
  input: {schema: GeneratePersonalizedInvestmentPortfolioInputSchema},
  output: {schema: GeneratePersonalizedInvestmentPortfolioOutputSchema},
  prompt: `You are an expert financial advisor. Given the following user profile analysis, create a personalized investment portfolio allocation.

User Profile Analysis: {{{userProfile}}}

Consider the user's risk tolerance, financial goals, and investment experience when determining the appropriate asset allocation.  Provide a summary of why you recommended this portfolio and how it aligns with the user's profile.

Format the portfolio allocation as a list of asset classes and their corresponding percentages.
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
