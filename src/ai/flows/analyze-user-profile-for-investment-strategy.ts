'use server';
/**
 * @fileOverview This file defines a Genkit flow for analyzing a user's profile, risk tolerance,
 * and financial goals to create a personalized investment strategy.
 *
 * - analyzeUserProfile - A function that triggers the user profile analysis flow.
 * - AnalyzeUserProfileInput - The input type for the analyzeUserProfile function.
 * - AnalyzeUserProfileOutput - The output type for the analyzeUserProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeUserProfileInputSchema = z.object({
  age: z.number().describe('The age of the user.'),
  riskTolerance: z
    .string()
    .describe(
      'The risk tolerance of the user (e.g., low, medium, high). Should be one of the following strings: low, medium, high.'
    ),
  financialGoals: z
    .string()
    .describe(
      'The financial goals of the user (e.g., retirement, buying a home, saving for education).'
    ),
  investmentExperience: z
    .string()
    .describe(
      'The investment experience of the user (e.g., none, beginner, intermediate, expert).  Should be one of the following strings: none, beginner, intermediate, expert.'
    ),
  income: z.number().describe('The annual income of the user.'),
  investmentAmount: z.number().describe('The total amount the user wants to invest.'),
});
export type AnalyzeUserProfileInput = z.infer<typeof AnalyzeUserProfileInputSchema>;

const AnalyzeUserProfileOutputSchema = z.object({
  investmentStrategy: z
    .string()
    .describe('A personalized investment strategy tailored to the user.'),
  assetAllocation: z
    .string()
    .describe(
      'The recommended asset allocation based on the user profile analysis (e.g., stocks, bonds, real estate).'
    ),
  riskAssessment: z
    .string()
    .describe('An assessment of the user risk profile based on the data provided.'),
});
export type AnalyzeUserProfileOutput = z.infer<typeof AnalyzeUserProfileOutputSchema>;

export async function analyzeUserProfile(input: AnalyzeUserProfileInput): Promise<AnalyzeUserProfileOutput> {
  return analyzeUserProfileFlow(input);
}

const analyzeUserProfilePrompt = ai.definePrompt({
  name: 'analyzeUserProfilePrompt',
  input: {schema: AnalyzeUserProfileInputSchema},
  output: {schema: AnalyzeUserProfileOutputSchema},
  prompt: `You are an expert investment advisor. Analyze the user profile and provide a personalized investment strategy, recommended asset allocation, and a risk assessment.

User Profile:
- Age: {{{age}}}
- Risk Tolerance: {{{riskTolerance}}}
- Financial Goals: {{{financialGoals}}}
- Investment Experience: {{{investmentExperience}}}
- Income: {{{income}}}
- Investment Amount: {{{investmentAmount}}}

Based on this information, provide the following:

Investment Strategy: A detailed investment strategy tailored to the user's needs and goals.
Asset Allocation: A recommended asset allocation percentage across different asset classes.
Risk Assessment: A risk assessment of the user profile based on the data provided.

Make the investment strategy and asset allocation appropriate for a beginner investor.`,
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
