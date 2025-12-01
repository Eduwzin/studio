'use server';

import {
  analyzeUserProfile as analyzeUserProfileFlow,
  AnalyzeUserProfileInput,
} from '@/ai/flows/analyze-user-profile-for-investment-strategy';
import {
  generatePersonalizedInvestmentPortfolio as generatePersonalizedInvestmentPortfolioFlow,
  GeneratePersonalizedInvestmentPortfolioInput,
} from '@/ai/flows/generate-personalized-investment-portfolio';
import {
  simulatePortfolioPerformance as simulatePortfolioPerformanceFlow,
  SimulatePortfolioPerformanceInput,
} from '@/ai/flows/simulate-portfolio-performance';
import {
  monitorInvestmentsForImprovements as monitorInvestmentsForImprovementsFlow,
  MonitorInvestmentsForImprovementsInput,
} from '@/ai/flows/monitor-investments-for-improvements';
import {
  recommendNextInvestmentSteps as recommendNextInvestmentStepsFlow,
  RecommendNextInvestmentStepsInput,
} from '@/ai/flows/recommend-next-investment-steps';
import {
  generateLesson as generateLessonFlow,
  GenerateLessonInput,
  GenerateLessonOutput
} from '@/ai/flows/generate-lesson-content';


export async function analyzeUserProfile(input: AnalyzeUserProfileInput) {
  const result = await analyzeUserProfileFlow(input);
  return result;
}

export async function generatePersonalizedInvestmentPortfolio(
  input: GeneratePersonalizedInvestmentPortfolioInput
) {
  const result = await generatePersonalizedInvestmentPortfolioFlow(input);
  return result;
}

export async function simulatePortfolioPerformance(
  input: SimulatePortfolioPerformanceInput
) {
  const result = await simulatePortfolioPerformanceFlow(input);
  return result;
}

export async function monitorInvestmentsForImprovements(
  input: MonitorInvestmentsForImprovementsInput
) {
  const result = await monitorInvestmentsForImprovementsFlow(input);
  return result;
}

export async function recommendNextInvestmentSteps(
  input: RecommendNextInvestmentStepsInput
) {
  const result = await recommendNextInvestmentStepsFlow(input);
  return result;
}

export async function generateLesson(input: GenerateLessonInput) {
  const result = await generateLessonFlow(input);
  return result;
}

export type { GenerateLessonInput, GenerateLessonOutput };
