
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
export interface StockInfo {
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
  // Novos campos adicionados
  priceToBook?: number;
  dividendYield?: number;
  bookValue?: number;
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

  const url = `${BRAPI_API_BASE_URL}/quote/${ticker}?token=${BRAPI_API_TOKEN}&fundamental=true&dividends=true`;

  try {
    // Adicionando revalidação para Next.js (a cada 15 minutos)
    const response = await fetch(url, { next: { revalidate: 900 } });
    
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
    // Não loga o erro no console para evitar poluição com tickers não encontrados.
    // O erro será tratado pelo chamador (que o ignora com .catch(e => null)).
    throw error; // Re-lança o erro para ser tratado pelo chamador
  }
}

/**
 * Representa a estrutura de dados esperada da resposta da API da Brapi para a taxa SELIC.
 */
export interface SelicRate {
    name: string;
    value: number;
}

/**
 * Busca a taxa SELIC atual da API da Brapi.
 * @returns Uma promessa que resolve para o valor da taxa SELIC.
 */
export async function getSelicRate(): Promise<number> {
    const token = "v7HL1xQumG7Unvpfc333zc";
    const url = `https://brapi.dev/api/v2/prime-rate?token=${token}`;

    try {
        const response = await fetch(url, { next: { revalidate: 900 } }); // 15 minutos de cache

        if (!response.ok) {
            throw new Error(`Erro na API da Brapi para SELIC: ${response.statusText}`);
        }
        const data = await response.json();

        if (!data.prime_rate || data.prime_rate.length === 0 || data.prime_rate[0].name !== 'selic') {
            throw new Error('Formato de resposta inesperado para a taxa SELIC.');
        }

        return data.prime_rate[0].value;
    } catch (error) {
        console.error("Falha ao buscar taxa SELIC:", error);
        throw error; // Re-lança o erro para ser tratado pelo chamador
    }
}
