'use server';

/**
 * @fileOverview An AI agent that monitors investments and suggests improvements based on changing market data.
 *
 * - monitorInvestmentsForImprovements - A function that initiates the investment monitoring process.
 * - MonitorInvestmentsForImprovementsInput - The input type for the monitorInvestmentsForImprovements function.
 * - MonitorInvestmentsForImprovementsOutput - The return type for the monitorInvestmentsForImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MonitorInvestmentsForImprovementsInputSchema = z.object({
  portfolio: z.string().describe('The current investment portfolio of the user.'),
  marketData: z.string().describe('The latest market data to be analyzed.'),
  userRiskProfile: z.string().describe('The user risk profile.'),
});
export type MonitorInvestmentsForImprovementsInput = z.infer<
  typeof MonitorInvestmentsForImprovementsInputSchema
>;

const MonitorInvestmentsForImprovementsOutputSchema = z.object({
  suggestedImprovements: z
    .string()
    .describe('The suggested improvements for the investment portfolio.'),
  rationale: z
    .string()
    .describe('The rationale behind the suggested improvements.'),
});
export type MonitorInvestmentsForImprovementsOutput = z.infer<
  typeof MonitorInvestmentsForImprovementsOutputSchema
>;

export async function monitorInvestmentsForImprovements(
  input: MonitorInvestmentsForImprovementsInput
): Promise<MonitorInvestmentsForImprovementsOutput> {
  return monitorInvestmentsForImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'monitorInvestmentsForImprovementsPrompt',
  input: {schema: MonitorInvestmentsForImprovementsInputSchema},
  output: {schema: MonitorInvestmentsForImprovementsOutputSchema},
  prompt: `You are an AI investment advisor tasked with monitoring investment portfolios and suggesting improvements based on market data and user risk profile.\n\nAnalyze the current investment portfolio, the latest market data, and the user's risk profile to identify potential improvements and optimizations.\n\nCurrent Investment Portfolio: {{{portfolio}}}\nLatest Market Data: {{{marketData}}}\nUser Risk Profile: {{{userRiskProfile}}}\n\nBased on your analysis, provide specific suggestions for improvements to the portfolio, along with a clear rationale for each suggestion.\n\nConsider factors such as diversification, risk-adjusted returns, and alignment with the user's investment goals.\n\n{{output}}`,
});

const monitorInvestmentsForImprovementsFlow = ai.defineFlow(
  {
    name: 'monitorInvestmentsForImprovementsFlow',
    inputSchema: MonitorInvestmentsForImprovementsInputSchema,
    outputSchema: MonitorInvestmentsForImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
