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
import {
  generateDailyNewsStories,
  GenerateStoriesInput,
  NewsStory,
} from '@/ai/flows/generate-daily-news-stories';
import { getDollarRate, getIpcaRate, getProjectedIpcaRate, getProjectedCurrentYearSelicRate, getProjectedNextYearSelicRate, getSelicRate, getStockInfo as getStockInfoService, StockInfo } from '@/services/brapi';
import { getMarketNews as getGNewsMarketNews } from '@/services/gnews';
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

export async function suggestAssets(input: SuggestAssetsInput): Promise<SuggestAssetsOutput> {
    return suggestAssetsFlow(input);
}

export async function chatWithMarketAnalyst(input: ChatInput): Promise<ChatOutput> {
    return chatWithMarketAnalystFlow(input);
}

export async function getStockInfo(ticker: string): Promise<StockInfo | null> {
    try {
        const stockInfo = await getStockInfoService(ticker, '1y', '1wk');
        return stockInfo;
    } catch (error) {
        console.error(`Failed to get stock info for ${ticker}:`, error);
        return null;
    }
}

export async function getDailyNewsAction(payload: { userId: string; userAssets?: string; forceRefresh?: boolean }): Promise<NewsStory[]> {
  const { userId, userAssets = '', forceRefresh = false } = payload;
  const db = getDb();

  const today = new Date();
  const dateId = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const docRef = doc(db, 'users', userId, 'dailyNews', dateId);

  // 1. Check for cached document unless a refresh is forced.
  if (!forceRefresh) {
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return (data.stories || []) as NewsStory[];
      }
    } catch (e) {
      console.error("Error reading news cache from Firestore:", e);
    }
  }

  // 2. If no cache exists for today (or refresh is forced), generate new stories.
  try {
    const rawNewsFromApi = await getGNewsMarketNews(20);

    if (!rawNewsFromApi || rawNewsFromApi.length === 0) {
      // Se a API não retornar nada, crie um cache vazio para evitar novas chamadas.
      await setDoc(docRef, { generatedAt: new Date().toISOString(), stories: [], version: '1.2.0-empty-api' });
      return [];
    }

    const cleanedNews = rawNewsFromApi
      .map((article, index) => ({
        id: article.url || `${article.title}-${index}`,
        title: article.title,
        summary_raw: article.description || article.content || '',
        url: article.url,
        source: article.source.name,
        publishedAt: article.publishedAt,
      }))
      .filter(article => article.url && article.title && article.summary_raw.length > 20);

    const uniqueNews = Array.from(new Map(cleanedNews.map(item => [item.url, item])).values());
    
    if (uniqueNews.length === 0) {
      await setDoc(docRef, { generatedAt: new Date().toISOString(), stories: [], version: '1.2.0-no-valid-news' });
      return [];
    }

    const input: GenerateStoriesInput = {
      rawNews: uniqueNews.slice(0, 20),
      userAssets: userAssets,
    };
    
    const aiResult = await generateDailyNewsStories(input);
    
    // Mesmo que o resultado da IA seja nulo ou vazio, salve para evitar novas chamadas.
    const stories = aiResult?.stories || [];
    
    const cachePayload = {
      generatedAt: new Date().toISOString(),
      stories: stories,
      rawItemsUsedIds: aiResult?.rawItemsUsedIds || [],
      version: '1.2.0-final'
    };
    await setDoc(docRef, cachePayload);
    
    return stories;

  } catch (error) {
    console.error("Error during news generation process:", error);
    // Em caso de erro na geração, também criamos um cache vazio para bloquear novas tentativas.
    try {
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, { 
          generatedAt: new Date().toISOString(), 
          stories: [], 
          version: '1.2.0-generation-failed' 
        });
      }
    } catch (cacheError) {
      console.error("CRITICAL: Failed to write empty cache after generation error:", cacheError);
    }
    // Retorna vazio para o cliente, mas a tentativa não será refeita.
    return [];
  }
}


export type { GenerateLessonInput, GenerateLessonOutput, MonitorPortfolioOutput };
