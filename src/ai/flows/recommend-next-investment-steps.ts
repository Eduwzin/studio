// RecommendNextInvestmentSteps Story: As a user with an existing portfolio, I want the application to suggest upcoming steps I can take in my investment portfolio using AI, so that I can proactively manage and evolve my investments over time.

'use server';

/**
 * @fileOverview This file defines a Genkit flow to recommend the next investment steps for a user's portfolio.
 *
 * - `recommendNextInvestmentSteps`:  Function to orchestrate the recommendation of next investment steps.
 * - `RecommendNextInvestmentStepsInput`:  Input type definition for the function.
 * - `RecommendNextInvestmentStepsOutput`:  Output type definition for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendNextInvestmentStepsInputSchema = z.object({
  userProfile: z.string().describe('The user profile including risk tolerance, financial goals, and investment knowledge.'),
  currentPortfolio: z.string().describe('The current investment portfolio of the user, including asset allocation and performance.'),
  marketConditions: z.string().describe('Current market conditions and trends.'),
});

export type RecommendNextInvestmentStepsInput = z.infer<typeof RecommendNextInvestmentStepsInputSchema>;

const RecommendNextInvestmentStepsOutputSchema = z.object({
  recommendedSteps: z.string().describe('A list of recommended next steps for the user to take in their investment portfolio.'),
  rationale: z.string().describe('The rationale behind the recommended steps, explaining why they are suitable for the user.'),
});

export type RecommendNextInvestmentStepsOutput = z.infer<typeof RecommendNextInvestmentStepsOutputSchema>;

export async function recommendNextInvestmentSteps(input: RecommendNextInvestmentStepsInput): Promise<RecommendNextInvestmentStepsOutput> {
  return recommendNextInvestmentStepsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendNextInvestmentStepsPrompt',
  input: {schema: RecommendNextInvestmentStepsInputSchema},
  output: {schema: RecommendNextInvestmentStepsOutputSchema},
  prompt: `Given the following user profile, current portfolio, and market conditions, recommend the next steps for the user's investment portfolio.

User Profile: {{{userProfile}}}
Current Portfolio: {{{currentPortfolio}}}
Market Conditions: {{{marketConditions}}}

Consider the user's risk tolerance, financial goals, and investment knowledge when making your recommendations.
Provide a clear rationale for each recommended step.

Ensure the recommendations are actionable and provide clear direction to the user.
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

