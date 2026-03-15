import { getStockInfo } from '@/services/brapi';
import { processCvmFiiFile } from '../lib/cvm-parser';

// Interface simples para tipagem local baseada no seu relato
interface StockInfo {
  symbol: string;
  shortName: string;
  regularMarketPrice: number;
  dividendYield?: number;
  [key: string]: any;
}

async function runTest() {
  const BRAPITOKEN = 'qEWkBzyhwUsDsseMXJ9Jhz';
  const range = '1d';
  const interval = '1d';
  const ticker = 'ITUB4';
  const url = `https://brapi.dev/api/quote/${ticker}?token=${BRAPITOKEN}&range=${range}&interval=${interval}&dividends=true&fundamental=true&modules=summaryProfile,financialData,defaultKeyStatistics`;

  const response = await fetch(url, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Erro na API da Brapi: ${response.statusText}`);
  }

  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    throw new Error(`Nenhuma informação encontrada para o ticker: ${ticker}`);
  }

  const result = data.results[0];
  const currentPrice = result.regularMarketPrice;

  // --- Cálculo do Dividend Yield (LTM - Last Twelve Months) ---
  let dividendYield = 0;
  if (result.dividendsData && result.dividendsData.cashDividends) {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const totalDividendsPaid = result.dividendsData.cashDividends
      .filter((div: any) => {
        const paymentDate = new Date(div.paymentDate);
        return paymentDate >= oneYearAgo;
      })
      .reduce((acc: number, div: any) => acc + div.rate, 0);

    // DY = (Total Dividendos / Preço Atual) * 100
    dividendYield = currentPrice > 0 ? (totalDividendsPaid / currentPrice) * 100 : 0;
    
    console.log(`Soma dividendos (12m): R$ ${totalDividendsPaid.toFixed(2)}`);
    console.log(`Preço Atual: R$ ${currentPrice.toFixed(2)}`);
    console.log(`DY Calculado: ${dividendYield.toFixed(2)}%`);
  }
  // ---------------------------------------------------------

  const stockInfo: StockInfo = {
    ...result,
    symbol: result.symbol,
    shortName: result.shortName,
    dividendYield: dividendYield // Adicionado ao objeto final
  };

  console.log("RESULTADO FINAL:", stockInfo);
}

runTest();
