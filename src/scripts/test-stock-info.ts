import { getStockInfo } from '@/services/brapi';
import { processCvmFiiFile } from '../lib/cvm-parser';

async function runTest() {
  const BRAPITOKEN = 'qEWkBzyhwUsDsseMXJ9Jhz'
  const range = '1y'
  const interval = '1d'
  const ticker = 'PETR4'
  const url = `https://brapi.dev/api/quote/${ticker}?token=${BRAPITOKEN}&range=${range}&interval=${interval}&fundamental=true&includeHistoricalData=true&modules=summaryProfile,financialData,defaultKeyStatistics`;
      const response = await fetch(url, { cache: 'no-store' });
  
      if (!response.ok) {
        throw new Error(`Erro na API da Brapi: ${response.statusText}`);
      }
      const data = await response.json();
      if (!data.results || data.results.length === 0) {
        throw new Error(`Nenhuma informação encontrada para o ticker: ${ticker}`);
      }
      console.log("RESULT:", data.results)
      const result = data.results[0];
  
      const stockInfo: StockInfo = {
        ...result,
        symbol: result.symbol,
        shortName: result.shortName,
        longName: result.longName,
        currency: result.currency,
        regularMarketPrice: result.regularMarketPrice,
        regularMarketDayHigh: result.regularMarketDayHigh,
        regularMarketDayLow: result.regularMarketDayLow,
        regularMarketChange: result.regularMarketChange,
        regularMarketChangePercent: result.regularMarketChangePercent,
        regularMarketTime: result.regularMarketTime,
        marketCap: result.marketCap,
        regularMarketVolume: result.regularMarketVolume,
        fiftyTwoWeekLow: result.fiftyTwoWeekLow,
        fiftyTwoWeekHigh: result.fiftyTwoWeekHigh,
        priceEarnings: result.priceEarnings,
        earningsPerShare: result.earningsPerShare,
        logourl: result.logourl,
        priceToBook: result.defaultKeyStatistics?.priceToBook,
        dividendYield: result.dividendYield,
        bookValue: result.defaultKeyStatistics?.bookValue,
        cnpj: result.summaryProfile?.cnpj,
        historicalDataPrice: result.historicalDataPrice,
      };
      console.log("LOGANDO STOCKINFO:", stockInfo)
      return stockInfo;
}

// Executa a função de teste
runTest();
