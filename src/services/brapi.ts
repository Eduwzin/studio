

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
    // Removida a revalidação para buscar dados em tempo real a cada chamada
    const response = await fetch(url, { cache: 'no-store' });
    
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
 * Representa a estrutura de dados esperada da resposta da API do BCB para a SELIC.
 */
interface BcbDataItem {
    data: string;
    valor: string;
}

/**
 * Busca a taxa SELIC atual da API do Banco Central do Brasil (BCB).
 * @returns Uma promessa que resolve para o valor numérico da taxa SELIC.
 */
export async function getSelicRate(): Promise<number> {
    const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/20?formato=json`;

    try {
        const response = await fetch(url, { next: { revalidate: 3600 } }); // 1 hora de cache

        if (!response.ok) {
            throw new Error(`Erro na API do BCB para SELIC: ${response.statusText}`);
        }
        
        const data: BcbDataItem[] = await response.json();

        if (!Array.isArray(data) || data.length === 0 || !data[0].valor) {
            throw new Error('Formato de resposta inesperado para a taxa SELIC do BCB.');
        }

        const selicValue = parseFloat(data[data.length - 1].valor);
        
        if (isNaN(selicValue)) {
            throw new Error('Valor da SELIC retornado pela API do BCB não é um número válido.');
        }

        return selicValue;
    } catch (error) {
        console.error("Falha ao buscar taxa SELIC na API do BCB:", error);
        throw error; // Re-lança o erro para ser tratado pelo chamador
    }
}


/**
 * Busca a taxa IPCA (inflação) acumulada dos últimos 12 meses da API do Banco Central do Brasil (BCB).
 * @returns Uma promessa que resolve para o valor numérico da taxa IPCA.
 */
export async function getIpcaRate(): Promise<number> {
    const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.10844/dados/ultimos/12?formato=json`;

    try {
        const response = await fetch(url, { next: { revalidate: 3600 } }); // 1 hora de cache

        if (!response.ok) {
            throw new Error(`Erro na API do BCB para IPCA: ${response.statusText}`);
        }
        
        const data: BcbDataItem[] = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Formato de resposta inesperado para a taxa IPCA do BCB.');
        }

        const totalIpca = data.reduce((sum, item) => {
            const value = parseFloat(item.valor);
            return sum + (isNaN(value) ? 0 : value);
        }, 0);
        
        return totalIpca;
    } catch (error) {
        console.error("Falha ao buscar taxa IPCA na API do BCB:", error);
        throw error; // Re-lança o erro para ser tratado pelo chamador
    }
}

/**
 * Representa a estrutura de dados da resposta da API de Expectativas de Mercado do BCB.
 */
interface FocusMarketDataItem {
    Indicador: string;
    Data: string;
    DataReferencia: string;
    Media: number;
    Mediana: number;
    DesvioPadrao: number;
    Minimo: number;
    Maximo: number;
    numeroRespondentes: number;
    baseCalculo: number;
}

interface FocusApiResponse {
    value: FocusMarketDataItem[];
}

/**
 * Busca a projeção da taxa SELIC (mediana) do relatório Focus do BCB.
 * @returns Uma promessa que resolve para o valor numérico da projeção da SELIC.
 */
export async function getProjectedSelicRate(): Promise<number> {
    const url = 'https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata/ExpectativasMercadoSelic?$top=1&$orderby=Data%20desc&$format=json';

    try {
        const response = await fetch(url, { next: { revalidate: 86400 } }); // Cache de 24 horas

        if (!response.ok) {
            throw new Error(`Erro na API Focus do BCB: ${response.statusText}`);
        }

        const data: FocusApiResponse = await response.json();
        
        if (!data.value || data.value.length === 0) {
            throw new Error('Formato de resposta inesperado da API Focus.');
        }

        const projectedRate = data.value[0].Mediana;

        if (typeof projectedRate !== 'number') {
            throw new Error('Valor da projeção da SELIC não é um número válido.');
        }
        
        return projectedRate;

    } catch (error) {
        console.error("Falha ao buscar projeção da SELIC na API Focus:", error);
        throw error; // Re-lança o erro para ser tratado pelo chamador
    }
}


/**
 * Busca a projeção da taxa IPCA (mediana) do relatório Focus do BCB.
 * @returns Uma promessa que resolve para o valor numérico da projeção do IPCA.
 */
export async function getProjectedIpcaRate(): Promise<number> {
    const url = 'https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata/ExpectativasMercadoInflacao24Meses?$top=1&$orderby=Data%20desc&$format=json';

    try {
        const response = await fetch(url, { next: { revalidate: 86400 } }); // Cache de 24 horas

        if (!response.ok) {
            throw new Error(`Erro na API Focus do BCB para IPCA: ${response.statusText}`);
        }

        const data: FocusApiResponse = await response.json();
        
        if (!data.value || data.value.length === 0) {
            throw new Error('Formato de resposta inesperado da API Focus para IPCA.');
        }

        const projectedRate = data.value[0].Mediana;

        if (typeof projectedRate !== 'number') {
            throw new Error('Valor da projeção do IPCA não é um número válido.');
        }
        
        return projectedRate;

    } catch (error) {
        console.error("Falha ao buscar projeção do IPCA na API Focus:", error);
        throw error;
    }
}
