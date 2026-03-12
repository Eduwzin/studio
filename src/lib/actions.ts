
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
  type GenerateLessonInput,
  type GenerateLessonOutput
} from '@/ai/flows/generate-lesson-content';
import {
    monitorPortfolio as monitorPortfolioFlow,
    type MonitorPortfolioInput,
    type MonitorPortfolioOutput,
} from '@/ai/flows/monitor-portfolio-flow';
import {
    suggestAssets as suggestAssetsFlow,
    type SuggestAssetsInput,
    type SuggestAssetsOutput,
    type AssetSuggestion,
} from '@/ai/flows/suggest-assets-flow';
import {
    chatWithMarketAnalyst as chatWithMarketAnalystFlow,
    type ChatInput,
    type ChatOutput,
} from '@/ai/flows/chat-with-market-analyst';
import {
  generateDailyNewsStories as generateDailyNewsStoriesFlow,
  type GenerateStoriesInput,
  type NewsStory,
} from '@/ai/flows/generate-daily-news-stories';
import {
  syncCvmFiis as syncCvmFiisFlow,
  type SyncCvmFiisInput,
  type SyncCvmFiisOutput,
} from '@/ai/flows/sync-cvm-fiis-flow';
import { getMarketNews } from '@/services/gnews';
import { getAvailableTickers, getDollarRate, getIpcaRate, getProjectedIpcaRate, getProjectedCurrentYearSelicRate, getProjectedNextYearSelicRate, getSelicRate, getStockInfo as getStockInfoService, type StockInfo } from '@/services/brapi';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

// Helper to initialize Firestore on the server if not already done.
// This is safe to call multiple times.
function getDb() {
  if (getApps().length) {
    return getFirestore(getApp());
  }
  const app = initializeApp(firebaseConfig);
  return getFirestore(app);
}

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

// Define um tipo de entrada simplificado para a chamada do lado do cliente
export type MonitorPortfolioClientInput = {
  userProfile: {
    riskProfile: string;
    investmentHorizon: string;
    riskTolerance: string;
  };
};

export async function monitorPortfolio(input: MonitorPortfolioClientInput): Promise<MonitorPortfolioOutput> {
    const selicRate = await getSelicRate().catch(() => 10.50);
    const ipcaRate = await getIpcaRate().catch(() => 3.9);
    const projectedCurrentYearSelic = await getProjectedCurrentYearSelicRate().catch(() => selicRate);
    const projectedNextYearSelic = await getProjectedNextYearSelicRate().catch(() => projectedCurrentYearSelic);
    const projectedIpcaRate = await getProjectedIpcaRate().catch(() => 3.8);
    const ifixData = await getStockInfoService('IFIX').catch(() => null);
    const ibovData = await getStockInfoService('^BVSP', '1y', '1d').catch(() => null);
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
            // With daily data, ~21 trading days in a month.
            const close30d = historicalData[21]?.close;
            if (close30d) ibovChange30d = ((latestClose - close30d) / close30d) * 100;

            const close365d = historicalData[historicalData.length - 1]?.close;
            if (close365d) ibovChange365d = ((latestClose - close365d) / close365d) * 100;
        }
    }
    
    // Constrói o input completo para o fluxo de IA internamente
    const fullInput: MonitorPortfolioInput = {
        userProfile: input.userProfile,
        projectedCurrentYearSelic: projectedCurrentYearSelic,
        projectedNextYearSelic: projectedNextYearSelic,
        projectedIpca: projectedIpcaRate,
        macroContext: {
            selicRate,
            selicTrend: 'estavel', // A IA deve inferir a tendência
            ipca12m: ipcaRate,
            ipcaTrend,
            ifixChange: ifixData?.regularMarketChangePercent ?? 0,
            ibovChange: ibovChange1d,
            ibovChange30d,
            ibovChange365d,
            dollarRate: dollarInfo.currentRate,
            marketSentiment: 'neutro' // A IA deve inferir o sentimento
        }
    };
    
    return monitorPortfolioFlow(fullInput);
}

export async function suggestAssets(clientInput: Omit<SuggestAssetsInput, 'availableStocks' | 'availableFiis' | 'availableEtfs'>): Promise<SuggestAssetsOutput> {
    const { stocks, fiis, bdrs } = await getAvailableTickers();

    const flowInput: SuggestAssetsInput = {
        ...clientInput,
        availableStocks: stocks.map(s => s.stock),
        availableFiis: fiis.map(f => f.stock),
        availableEtfs: bdrs.map(b => b.stock),
    };
    return suggestAssetsFlow(flowInput);
}

export async function chatWithMarketAnalyst(input: ChatInput): Promise<ChatOutput> {
    return chatWithMarketAnalystFlow(input);
}

export async function getStockInfo(ticker: string): Promise<StockInfo | null> {
    try {
        const stockInfo = await getStockInfoService(ticker, '1y', '1d');
        return stockInfo;
    } catch (error) {
        console.error(`Failed to get stock info for ${ticker}:`, error);
        return null;
    }
}

export async function getDailyNewsAction(
    { userId, userAssets, forceRefresh = false }: { userId: string; userAssets: string; forceRefresh?: boolean }
): Promise<NewsStory[]> {
    const db = getDb();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const cacheRef = doc(db, 'users', userId, 'dailyNewsCache', today);

    if (!forceRefresh) {
        try {
            const cacheSnap = await getDoc(cacheRef);
            if (cacheSnap.exists()) {
                const data = cacheSnap.data();
                // Also check if the assets used for caching match the current user assets
                if (data.stories && data.stories.length > 0 && data.userAssets === userAssets) {
                     return data.stories;
                }
            }
        } catch (error) {
            console.error("Error reading from daily news cache:", error);
            // Don't block, proceed to fetch fresh news
        }
    }

    const rawArticles = await getMarketNews(25);
    if (rawArticles.length === 0) {
        return []; // Return empty if no news is fetched
    }

    const generateStoriesInput: GenerateStoriesInput = {
        rawNews: rawArticles.map(a => ({
            id: a.url,
            title: a.title,
            summary_raw: a.description,
            url: a.url,
            source: a.source.name,
            publishedAt: a.publishedAt,
        })),
        userAssets: userAssets,
    };

    const result = await generateDailyNewsStoriesFlow(generateStoriesInput);

    // Cache the result in Firestore for future requests
    if (result.stories.length > 0) {
        try {
            await setDoc(cacheRef, { 
                stories: result.stories, 
                userAssets: userAssets, // Store the assets used for this cache
                createdAt: new Date().toISOString() 
            });
        } catch(error) {
             console.error("Error writing to daily news cache:", error);
             // Don't block the user, just log the error
        }
    }

    return result.stories;
}

export async function syncCvmDataAction(input: SyncCvmFiisInput): Promise<SyncCvmFiisOutput> {
  return syncCvmFiisFlow(input);
}

// Tipo para os dados do relatório, espelhando o que é salvo no Firestore
export type FiiCvmReport = {
  id: string;
  cnpj: string;
  nomeFundo: string;
  dataReferencia: string;
  patrimonioLiquido: number;
  valorPatrimonialCota: number;
  quantidadeCotas: number;
  rendimentosMes: number | null;
};

export async function getRecentReportsAction(): Promise<FiiCvmReport[]> {
    try {
        const { initializeApp, getApps } = await import('firebase-admin/app');
        const { getFirestore } = await import('firebase-admin/firestore');
        
        if (!getApps().length) {
            initializeApp();
        }
        const db = getFirestore();

        const reportsRef = db.collection('fii-reports-cvm');
        const snapshot = await reportsRef.orderBy('dataReferencia', 'desc').limit(20).get();

        if (snapshot.empty) {
            return [];
        }

        return snapshot.docs.map(doc => doc.data() as FiiCvmReport);
    } catch (error) {
        console.error("Falha ao buscar relatórios de FIIs do Firestore via action:", error);
        return [];
    }
}


export type { GenerateLessonInput, GenerateLessonOutput, MonitorPortfolioOutput, NewsStory, SuggestAssetsOutput, AssetSuggestion, SyncCvmFiisInput, SyncCvmFiisOutput, FiiCvmReport };
