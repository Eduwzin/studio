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
import {
    monitorPortfolio as monitorPortfolioFlow,
    MonitorPortfolioInput,
    MonitorPortfolioOutput,
} from '@/ai/flows/monitor-portfolio-flow';
import {
    suggestAssets as suggestAssetsFlow,
    SuggestAssetsInput,
    SuggestAssetsOutput,
} from '@/ai/flows/suggest-assets-flow';
import {
    chatWithMarketAnalyst as chatWithMarketAnalystFlow,
    ChatInput,
    ChatOutput,
} from '@/ai/flows/chat-with-market-analyst';
import { getDollarRate, getIpcaRate, getProjectedIpcaRate, getProjectedCurrentYearSelicRate, getProjectedNextYearSelicRate, getSelicRate, getStockInfo as getStockInfoService, StockInfo } from '@/services/brapi';


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

export async function monitorPortfolio(input: MonitorPortfolioInput): Promise<MonitorPortfolioOutput> {
    const selicRate = await getSelicRate().catch(() => 10.50);
    const ipcaRate = await getIpcaRate().catch(() => 3.9);
    const projectedCurrentYearSelic = await getProjectedCurrentYearSelicRate().catch(() => selicRate);
    const projectedNextYearSelic = await getProjectedNextYearSelicRate().catch(() => projectedCurrentYearSelic);
    const projectedIpcaRate = await getProjectedIpcaRate().catch(() => 3.8);
    const ifixData = await getStockInfoService('IFIX').catch(() => null);
    const ibovData = await getStockInfoService('^BVSP', '1y', '1wk').catch(() => null);
    const dollarInfo = await getDollarRate().catch(() => ({ currentRate: 5.25, history: [] }));

    let ipcaTrend: 'alta' | 'queda' | 'estavel';
    if (projectedIpcaRate < ipcaRate) ipcaTrend = 'queda';
    else if (projectedIpcaRate > ipcaRate) ipcaTrend = 'alta';
    else ipcaTrend = 'estavel';

    let ibovChange1d = ibovData?.regularMarketChangePercent ?? 0;
    let ibovChange30d = 0;
    let ibovChange365d = 0;

     if (ibovData?.historicalDataPrice && ibovData.historicalDataPrice.length > 0) {
        const historicalData = ibovData.historicalDataPrice.sort((a, b) => b.date - a.date);
        const latestClose = historicalData[0]?.close;
        
        if (latestClose) {
            const close30d = historicalData[4]?.close; // ~4 semanas
            if (close30d) ibovChange30d = ((latestClose - close30d) / close30d) * 100;

            const close365d = historicalData[historicalData.length - 1]?.close;
            if (close365d) ibovChange365d = ((latestClose - close365d) / close365d) * 100;
        }
    }
    
    const fullInput: MonitorPortfolioInput = {
        ...input,
        projectedCurrentYearSelic: projectedCurrentYearSelic,
        projectedNextYearSelic: projectedNextYearSelic,
        projectedIpca: projectedIpcaRate,
        macroContext: {
            selicRate,
            selicTrend: 'estavel',
            ipca12m: ipcaRate,
            ipcaTrend,
            ifixChange: ifixData?.regularMarketChangePercent ?? 0,
            ibovChange: ibovChange1d,
            ibovChange30d,
            ibovChange365d,
            dollarRate: dollarInfo.currentRate,
            marketSentiment: 'neutro'
        }
    };
    
    return monitorPortfolioFlow(fullInput);
}

export async function suggestAssets(input: SuggestAssetsInput): Promise<SuggestAssetsOutput> {
    return suggestAssetsFlow(input);
}

export async function chatWithMarketAnalyst(input: ChatInput): Promise<ChatOutput> {
    return chatWithMarketAnalystFlow(input);
}

export async function getStockInfo(ticker: string): Promise<StockInfo | null> {
    try {
        const stockInfo = await getStockInfoService(ticker);
        return stockInfo;
    } catch (error) {
        console.error(`Failed to get stock info for ${ticker}:`, error);
        return null;
    }
}


export type { GenerateLessonInput, GenerateLessonOutput, MonitorPortfolioInput, MonitorPortfolioOutput };