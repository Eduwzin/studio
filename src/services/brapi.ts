

/**
 * @fileOverview Serviço para interagir com a API da Brapi para obter dados do mercado de ações.
 *
 * - getStockInfo - Uma função para buscar informações sobre um ticker de ação específico.
 * - getAvailableTickers - Uma função para buscar uma lista de todos os tickers disponíveis.
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
  marketCap: number | null;
  regularMarketVolume: number;
  fiftyTwoWeekLow: number;
  fiftyTwoWeekHigh: number;
  priceEarnings: number | null;
  earningsPerShare: number | null;
  logourl: string;
  // Novos campos adicionados
  priceToBook?: number;
  dividendYield?: number;
  bookValue?: number;
  historicalDataPrice?: { date: number; open: number; high: number; low: number; close: number; volume: number; adjustedClose: number; }[];
}

/**
 * Busca informações detalhadas para um único ticker de ação da API da Brapi.
 * @param ticker O ticker da ação a ser buscado (ex: "PETR4", "MGLU3").
 * @param range O intervalo de tempo para os dados históricos (ex: "1y", "6mo").
 * @param interval O intervalo entre os pontos de dados (ex: "1d", "1wk").
 * @returns Uma promessa que resolve para o objeto de informações da ação.
 * @throws Lança um erro se o ticker não for encontrado ou se houver um problema com a solicitação da API.
 */
export async function getStockInfo(ticker: string, range?: string, interval?: string): Promise<StockInfo> {
  try {
    if (!BRAPI_API_TOKEN) {
      throw new Error('A chave da API da Brapi (BRAPI_API_TOKEN) não está configurada no ambiente.');
    }

    let url = `${BRAPI_API_BASE_URL}/quote/${ticker}?token=${BRAPI_API_TOKEN}&fundamental=true`;

    if (range && interval) {
      url += `&range=${range}&interval=${interval}`;
    }

    // Força a busca de dados em tempo real a cada chamada
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
 * Representa a estrutura de dados da resposta da API do BCB para a SELIC.
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
    const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/12?formato=json`;

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
 * Busca a projeção da taxa SELIC (mediana) do relatório Focus do BCB para o ano corrente.
 * @returns Uma promessa que resolve para o valor numérico da projeção da SELIC.
 */
export async function getProjectedCurrentYearSelicRate(): Promise<number> {
    const currentYear = new Date().getFullYear();
    const url = `https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata/ExpectativasMercadoAnuais?$filter=Indicador%20eq%20'Selic'%20and%20DataReferencia%20eq%20'${currentYear}'&$top=1&$orderby=Data%20desc&$format=json`;

    try {
        const response = await fetch(url, { next: { revalidate: 86400 } }); // Cache de 24 horas

        if (!response.ok) {
            throw new Error(`Erro na API Focus do BCB (Anual): ${response.statusText}`);
        }

        const data: FocusApiResponse = await response.json();
        
        if (!data.value || data.value.length === 0) {
            // Fallback para a API sem filtro de ano, caso a específica falhe
             const fallbackUrl = 'https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata/ExpectativasMercadoAnuais?$filter=Indicador%20eq%20%27Selic%27&$top=1&$orderby=Data%20desc&$format=json';
             const fallbackResponse = await fetch(fallbackUrl);
             const fallbackData: FocusApiResponse = await fallbackResponse.json();
             if (!fallbackData.value || fallbackData.value.length === 0) {
                 throw new Error('Formato de resposta inesperado da API Focus Anual.');
             }
             return fallbackData.value[0].Mediana;
        }

        const projectedRate = data.value[0].Mediana;

        if (typeof projectedRate !== 'number') {
            throw new Error('Valor da projeção da SELIC Anual não é um número válido.');
        }
        
        return projectedRate;

    } catch (error) {
        console.error("Falha ao buscar projeção da SELIC Anual na API Focus:", error);
        throw error; // Re-lança o erro para ser tratado pelo chamador
    }
}


/**
 * Busca a projeção da taxa SELIC (mediana) do relatório Focus do BCB para o ano seguinte.
 * @returns Uma promessa que resolve para o valor numérico da projeção da SELIC.
 */
export async function getProjectedNextYearSelicRate(): Promise<number> {
    const url = 'https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata/ExpectativasMercadoSelic?$top=1&$orderby=Data%20desc&$format=json';

    try {
        const response = await fetch(url, { next: { revalidate: 86400 } }); // Cache de 24 horas

        if (!response.ok) {
            throw new Error(`Erro na API Focus do BCB para Selic Futura: ${response.statusText}`);
        }

        const data: FocusApiResponse = await response.json();
        
        if (!data.value || data.value.length === 0) {
            throw new Error('Formato de resposta inesperado da API Focus para Selic Futura.');
        }

        const projectedRate = data.value[0].Mediana;

        if (typeof projectedRate !== 'number') {
            throw new Error('Valor da projeção da SELIC futura não é um número válido.');
        }
        
        return projectedRate;

    } catch (error) {
        console.error("Falha ao buscar projeção da SELIC futura na API Focus:", error);
        throw error;
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

export type DollarInfo = {
    currentRate: number;
    history: BcbDataItem[];
};

/**
 * Busca a cotação do Dólar (PTAX) mais recente da API do Banco Central do Brasil (BCB).
 * A função agora busca os dados dos últimos 120 dias para garantir que a informação esteja sempre atualizada.
 * @returns Uma promessa que resolve com a cotação mais recente e o histórico dos últimos dias.
 */
export async function getDollarRate(): Promise<DollarInfo> {
    const today = new Date();
    const endDateObj = new Date(today);
    const dataFinal = `${String(endDateObj.getMonth() + 1).padStart(2, '0')}-${String(endDateObj.getDate()).padStart(2, '0')}-${endDateObj.getFullYear()}`;

    const startDateObj = new Date(today);
    startDateObj.setDate(today.getDate() - 120);
    const dataInicial = `${String(startDateObj.getMonth() + 1).padStart(2, '0')}-${String(startDateObj.getDate()).padStart(2, '0')}-${startDateObj.getFullYear()}`;
    
    const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial='${dataInicial}'&@dataFinalCotacao='${dataFinal}'&$top=120&$orderby=dataHoraCotacao%20desc&$format=json`;

    try {
        const response = await fetch(url, { next: { revalidate: 3600 } }); // 1 hora de cache

        if (!response.ok) {
            throw new Error(`Erro na API do BCB para cotação do Dólar: ${response.statusText}`);
        }

        const data = await response.json();
        const cotacoes = data.value;


        if (!Array.isArray(cotacoes) || cotacoes.length === 0) {
            const fallbackUrl = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.10813/dados/ultimos/1?formato=json';
            const fallbackResponse = await fetch(fallbackUrl);
            if (!fallbackResponse.ok) throw new Error('Falha na API de fallback do BCB para Dólar.');
            const fallbackData: BcbDataItem[] = await fallbackResponse.json();
            if (fallbackData.length === 0) throw new Error('Dados de fallback para o Dólar também estão vazios.');
            const lastValue = parseFloat(fallbackData[0].valor);
            if (isNaN(lastValue)) throw new Error('Valor de fallback do Dólar não é um número válido.');
            const bcbHistory = fallbackData.map(item => ({ data: item.data, valor: item.valor }));
            return { currentRate: lastValue, history: bcbHistory };
        }

        const latestData = cotacoes[0];
        const dollarValue = latestData.cotacaoCompra;

        if (isNaN(dollarValue)) {
            throw new Error('Valor da cotação do Dólar retornado pela API do BCB não é um número válido.');
        }
        
        const history: BcbDataItem[] = cotacoes.map((item: any) => ({
             data: new Date(item.dataHoraCotacao).toLocaleDateString('pt-BR'),
             valor: item.cotacaoCompra.toString()
        }));

        return { currentRate: dollarValue, history: history };

    } catch (error) {
        console.error("Falha ao buscar cotação do Dólar na API do BCB:", error);
        throw error;
    }
}

/**
 * Representa a estrutura de dados esperada da resposta da API da Brapi para a lista de tickers.
 */
export interface AvailableTicker {
  stock: string;
  name: string;
  logo: string;
  type: string;
  sector?: string;
}

export interface AvailableTickersResponse {
  stocks: AvailableTicker[];
  fiis: AvailableTicker[];
  bdrs: AvailableTicker[];
}

/**
 * Busca a lista de todos os tickers disponíveis (ações, FIIs, BDRs) da API da Brapi.
 * @returns Uma promessa que resolve para um objeto contendo arrays de tickers.
 */
export async function getAvailableTickers(): Promise<AvailableTickersResponse> {
  const fetchTickers = async (type: 'stock' | 'fund' | 'bdr') => {
    try {
        if (!BRAPI_API_TOKEN) {
            throw new Error('A chave da API da Brapi (BRAPI_API_TOKEN) não está configurada no ambiente.');
        }
      const url = `${BRAPI_API_BASE_URL}/quote/list?token=${BRAPI_API_TOKEN}&type=${type}`;
      const response = await fetch(url, { next: { revalidate: 86400 } }); // Cache 24h

      if (!response.ok) {
        console.error(`Erro na API da Brapi para o tipo ${type}: ${response.statusText}`);
        return [];
      }
      const data = await response.json();
      // A API /quote/list retorna uma chave 'stocks' para todos os tipos.
      // Nós adicionamos o campo 'type' manualmente para uso no frontend.
      return (data.stocks || []).map((ticker: any) => ({
        stock: ticker.stock,
        name: ticker.name,
        logo: ticker.logo,
        sector: ticker.sector,
        type: type,
      }));
    } catch (error) {
      console.error(`Falha ao buscar tickers do tipo ${type}:`, error);
      return []; // Retorna array vazio em caso de erro para este tipo
    }
  };

  try {
    const [stocks, fiis, bdrs] = await Promise.all([
      fetchTickers('stock'),
      fetchTickers('fund'), // 'fund' na API da Brapi corresponde a FIIs
      fetchTickers('bdr')
    ]);

    return { stocks, fiis, bdrs };
  } catch (error) {
    console.error("Falha geral ao buscar listas de tickers da Brapi:", error);
    return { stocks: [], fiis: [], bdrs: [] };
  }
}
