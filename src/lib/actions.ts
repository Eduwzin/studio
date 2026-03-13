
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
import {
  summarizeAssetPerformance as summarizeAssetPerformanceFlow,
  type SummarizeAssetPerformanceInput,
  type SummarizeAssetPerformanceOutput,
} from '@/ai/flows/summarize-asset-performance';
import { getMarketNews } from '@/services/gnews';
import { getAvailableTickers, getDollarRate, getIpcaRate, getProjectedIpcaRate, getProjectedCurrentYearSelicRate, getProjectedNextYearSelicRate, getSelicRate, getStockInfo as getStockInfoService, type StockInfo } from '@/services/brapi';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, collection, query, orderBy, limit } from 'firebase/firestore';
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
  // Client-side processing logic
  try {
    const { fileContent, fileName } = input;
    
    // Dynamically import JSZip
    const JSZip = (await import('jszip')).default;

    // Convert Data URL to Buffer
    const zipBuffer = Buffer.from(fileContent.substring(fileContent.indexOf(',') + 1), 'base64');
    const zip = await JSZip.loadAsync(zipBuffer);
    
    const csvFileName = Object.keys(zip.files).find(name => name.toLowerCase().endsWith('.csv'));
    if (!csvFileName) {
      throw new Error('Nenhum arquivo CSV encontrado no ZIP.');
    }
    const csvContent = await zip.files[csvFileName].async('string');

    // Dynamically import PapaParse
    const Papa = (await import('papaparse')).default;
    const { data: records, errors } = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      delimiter: ';',
      encoding: 'latin1',
    });

    if (errors.length > 0) {
      console.warn('Erros de parsing no CSV:', errors);
    }
    if (records.length === 0) {
      return {
        status: 'EMPTY',
        message: 'O arquivo CSV estava vazio ou não pôde ser lido.',
        importedCount: 0,
      };
    }

    const db = getDb();
    
    // Normalize data
    const normalizedData = (records as any[]).map(record => {
      const cnpj = record.CNPJ_FUNDO;
      const dataReferencia = record.DT_COMPTC;
      const [year, month] = dataReferencia.split('-');
      const id = `${cnpj}-${year}-${month}`;
      
      return {
        id,
        cnpj,
        nomeFundo: record.DENOM_SOCIAL,
        dataReferencia,
        patrimonioLiquido: parseFloat(record.VL_PATRIM_LIQ) || 0,
        valorPatrimonialCota: parseFloat(record.VL_QUOTA) || 0,
        quantidadeCotas: parseInt(record.NR_COTST, 10) || parseInt(record.QTD_COTA_EMIT, 10) || 0,
        rendimentosMes: parseFloat(record.VL_REND_DIST) || parseFloat(record.REND_DIST_COTA) || null,
        // We don't use serverTimestamp on the client
        lastUpdated: new Date().toISOString(),
      };
    }).filter(fii => fii.cnpj && fii.dataReferencia);

    // Batch write to Firestore
    const batchSize = 500;
    let importedCount = 0;
    const { writeBatch } = await import('firebase/firestore');

    for (let i = 0; i < normalizedData.length; i += batchSize) {
      const batch = writeBatch(db);
      const chunk = normalizedData.slice(i, i + batchSize);
      chunk.forEach(fii => {
        const docRef = doc(db, 'fii-reports-cvm', fii.id);
        batch.set(docRef, fii, { merge: true });
      });
      await batch.commit();
      importedCount += chunk.length;
    }

    return {
      status: 'SUCCESS',
      message: `Importação do arquivo '${fileName}' concluída com sucesso.`,
      importedCount,
    };
  } catch (error: any) {
    console.error('Erro durante a sincronização do lado do cliente:', error);
    return {
      status: 'FAILED',
      message: error.message || 'Ocorreu um erro desconhecido durante o fluxo.',
      importedCount: 0,
    };
  }
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
        const db = getDb();
        const reportsRef = collection(db, 'fii-reports-cvm');
        const q = query(reportsRef, orderBy('dataReferencia', 'desc'), limit(20));
        const snapshot = await getDoc(q as any); // Type assertion to bypass signature issue

        if (snapshot.empty) {
            return [];
        }

        return snapshot.docs.map((doc: any) => doc.data() as FiiCvmReport);
    } catch (error) {
        console.error("Falha ao buscar relatórios de FIIs do Firestore via action:", error);
        return [];
    }
}

export async function getFiiCvmReportByCnpj(cnpj: string): Promise<FiiCvmReport | null> {
    if (!cnpj) return null;
    try {
        const db = getDb();

        const reportsRef = collection(db, 'fii-reports-cvm');
        const q = query(reportsRef, where('cnpj', '==', cnpj), orderBy('dataReferencia', 'desc'), limit(1));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return null;
        }

        return snapshot.docs[0].data() as FiiCvmReport;
    } catch (error) {
        console.error(`Falha ao buscar relatório CVM para o CNPJ ${cnpj}:`, error);
        return null;
    }
}

export async function getWatchlistDetailsAction(tickers: string[]): Promise<StockInfo[]> {
    if (!tickers || tickers.length === 0) {
        return [];
    }
    
    try {
        // Use allSettled to prevent one failed ticker from rejecting the whole promise
        const results = await Promise.allSettled(
            tickers.map(ticker => getStockInfoService(ticker))
        );
        
        const successfulResults: StockInfo[] = [];
        results.forEach(result => {
            if (result.status === 'fulfilled' && result.value) {
                successfulResults.push(result.value);
            } else if (result.status === 'rejected') {
                console.warn(`Failed to fetch details for a ticker in watchlist:`, result.reason);
            }
        });

        return successfulResults;

    } catch (error) {
        console.error("Failed to fetch watchlist details:", error);
        return [];
    }
}

export async function summarizeAssetPerformanceAction(input: SummarizeAssetPerformanceInput): Promise<SummarizeAssetPerformanceOutput> {
    // A API da Brapi retorna os dados ordenados do mais antigo para o mais recente.
    // O prompt da IA espera do mais recente para o mais antigo.
    // Portanto, precisamos inverter a ordem do array aqui.
    const sortedData = [...input.historicalData].sort((a, b) => b.date - a.date);

    const sortedInput = {
        ...input,
        historicalData: sortedData,
    };
    
    return summarizeAssetPerformanceFlow(sortedInput);
}


export type { GenerateLessonInput, GenerateLessonOutput, MonitorPortfolioOutput, NewsStory, SuggestAssetsOutput, AssetSuggestion, SyncCvmFiisInput, SyncCvmFiisOutput, FiiCvmReport, SummarizeAssetPerformanceInput, SummarizeAssetPerformanceOutput };

    