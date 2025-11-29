
/**
 * @fileOverview Serviço para interagir com a API da Brapi para obter dados do mercado de ações.
 *
 * - getStockInfo - Uma função para buscar informações sobre um ticker de ação específico.
 */

const BRAPI_API_BASE_URL = 'https://brapi.dev/api';
const BRAPI_API_TOKEN = process.env.BRAPI_API_TOKEN;

/**
 * Representa a estrutura de dados esperada da resposta da API da Brapi para uma única ação.
 */
interface StockInfo {
  symbol: string;
  shortName: string;
  longName: string;
  currency: string;
  regularMarketPrice: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketTime: string;
  marketCap: number;
  regularMarketVolume: number;
  fiftyTwoWeekLow: number;
  fiftyTwoWeekHigh: number;
  priceEarnings: number;
  earningsPerShare: number;
  logourl: string;
}

/**
 * Busca informações detalhadas para um único ticker de ação da API da Brapi.
 * @param ticker O ticker da ação a ser buscado (ex: "PETR4", "MGLU3").
 * @returns Uma promessa que resolve para o objeto de informações da ação.
 * @throws Lança um erro se o ticker não for encontrado ou se houver um problema com a solicitação da API.
 */
export async function getStockInfo(ticker: string): Promise<StockInfo> {
  if (!BRAPI_API_TOKEN) {
    throw new Error('A chave da API da Brapi (BRAPI_API_TOKEN) não está configurada no ambiente.');
  }

  const url = `${BRAPI_API_BASE_URL}/quote/${ticker}?token=${BRAPI_API_TOKEN}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro na API da Brapi: ${response.statusText}`);
    }
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error(`Nenhuma informação encontrada para o ticker: ${ticker}`);
    }

    // A API retorna um array, mesmo para uma única consulta de ticker.
    return data.results[0] as StockInfo;
  } catch (error) {
    console.error(`Falha ao buscar informações da ação para ${ticker}:`, error);
    throw error; // Re-lança o erro para ser tratado pelo chamador
  }
}
