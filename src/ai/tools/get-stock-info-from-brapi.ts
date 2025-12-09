
'use server';
/**
 * @fileOverview Ferramenta Genkit para buscar informações de ações da API da Brapi.
 *
 * - getStockInfoFromBrapi - Uma ferramenta que a IA pode usar para obter dados de mercado em tempo real para um ticker de ação específico.
 */

import { ai } from '@/ai/genkit';
import { getStockInfo } from '@/services/brapi';
import { z } from 'genkit';

// Define o esquema de entrada para a ferramenta, esperando um único ticker de ação.
const StockInfoInputSchema = z.object({
  ticker: z.string().describe('O ticker da ação a ser pesquisado (por exemplo, "PETR4", "MGLU3").'),
});

// Define o esquema de saída, que corresponde à estrutura de dados retornada pelo nosso serviço Brapi.
const StockInfoOutputSchema = z.object({
  symbol: z.string(),
  shortName: z.string(),
  longName: z.string(),
  currency: z.string(),
  regularMarketPrice: z.number(),
  regularMarketDayHigh: z.number(),
  regularMarketDayLow: z.number(),
  regularMarketChange: z.number(),
  regularMarketChangePercent: z.number(),
  regularMarketTime: z.string(),
  marketCap: z.number().nullable(),
  regularMarketVolume: z.number(),
  fiftyTwoWeekLow: z.number(),
  fiftyTwoWeekHigh: z.number(),
  priceEarnings: z.number().nullable(),
  earningsPerShare: z.number().nullable(),
  logourl: z.string(),
});

/**
 * Uma ferramenta Genkit que permite à IA buscar informações de ações da API da Brapi.
 * A IA pode invocar esta ferramenta quando precisa de dados atuais do mercado para tomar decisões
 * ou fornecer informações, como em fluxos para monitorar portfólios ou recomendar os próximos passos.
 */
export const getStockInfoFromBrapi = ai.defineTool(
  {
    name: 'getStockInfoFromBrapi',
    description: 'Busca informações de mercado em tempo real para um ticker de ação específico usando a API da Brapi. Use isso para obter preços atuais, mudanças diárias, capitalização de mercado, etc.',
    inputSchema: StockInfoInputSchema,
    outputSchema: StockInfoOutputSchema,
  },
  async (input) => {
    console.log(`Chamando a ferramenta getStockInfoFromBrapi com o ticker: ${input.ticker}`);
    try {
      // Chama a função de serviço que interage com a API da Brapi.
      const stockInfo = await getStockInfo(input.ticker);
      return stockInfo;
    } catch (error) {
      console.error(`Erro na ferramenta getStockInfoFromBrapi para o ticker ${input.ticker}:`, error);
      // Retorna uma mensagem de erro estruturada que a IA pode entender.
      throw new Error(`Não foi possível buscar informações para ${input.ticker}. A ação pode não existir ou pode haver um problema com a API.`);
    }
  }
);
