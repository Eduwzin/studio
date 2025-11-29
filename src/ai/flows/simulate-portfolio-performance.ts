'use server';

/**
 * @fileOverview Simulates the performance of a portfolio over time using AI, incorporating forward-looking data, and suggests improvements.
 *
 * - simulatePortfolioPerformance - A function that handles the portfolio performance simulation.
 * - SimulatePortfolioPerformanceInput - The input type for the simulatePortfolioPerformance function.
 * - SimulatePortfolioPerformanceOutput - The return type for the simulatePortfolioPerformance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulatePortfolioPerformanceInputSchema = z.object({
  portfolioDescription: z
    .string()
    .describe('A detailed description of the current investment portfolio, including asset allocation and historical performance.'),
  marketConditions: z
    .string()
    .describe('A summary of current market conditions and economic forecasts.'),
  investmentGoals: z
    .string()
    .describe('The user’s investment goals, risk tolerance, and time horizon.'),
});
export type SimulatePortfolioPerformanceInput = z.infer<
  typeof SimulatePortfolioPerformanceInputSchema
>;

const SimulatePortfolioPerformanceOutputSchema = z.object({
  projectedPerformance: z
    .string()
    .describe('A detailed projection of the portfolio’s performance over the specified time horizon, including potential growth and risks.'),
  suggestedImprovements: z
    .string()
    .describe(
      'Specific recommendations for improving the portfolio’s performance, such as rebalancing asset allocation or adjusting investment strategies.'
    ),
  riskAnalysis: z
    .string()
    .describe('An analysis of the portfolio’s risk exposure and potential mitigation strategies.'),
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
  prompt: `You are an AI investment advisor tasked with simulating the performance of a user's investment portfolio over time.

  Based on the provided portfolio description, current market conditions, and the user's investment goals, provide a detailed projection of the portfolio's performance, along with suggested improvements and a risk analysis.

  Portfolio Description: {{{portfolioDescription}}}
  Market Conditions: {{{marketConditions}}}
  Investment Goals: {{{investmentGoals}}}

  Focus on providing actionable insights that the user can use to make informed decisions about their investment strategy.
  Follow the schema to produce the output.
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
