'use server';
/**
 * @fileOverview Este arquivo define um fluxo Genkit para resumir o desempenho recente de um ativo.
 *
 * - summarizeAssetPerformance: A função que gera o resumo.
 * - SummarizeAssetPerformanceInput: O tipo de entrada para a função.
 * - SummarizeAssetPerformanceOutput: O tipo de saída para a função.
 */

import { ai, geminiModel } from '@/ai/genkit';
import { z } from 'genkit';

const HistoricalDataPointSchema = z.object({
  date: z.number().describe('O timestamp UNIX da data.'),
  close: z.number().describe('O preço de fechamento do ativo na data.'),
});

const SummarizeAssetPerformanceInputSchema = z.object({
  ticker: z.string().describe('O ticker do ativo.'),
  historicalData: z.array(HistoricalDataPointSchema).describe('Uma lista de dados históricos de preços (fechamento) para o ativo, ordenados do mais recente para o mais antigo.'),
});
export type SummarizeAssetPerformanceInput = z.infer<typeof SummarizeAssetPerformanceInputSchema>;

const SummarizeAssetPerformanceOutputSchema = z.object({
  summary: z.string().describe('Um resumo conciso (uma frase) do desempenho recente do ativo.'),
});
export type SummarizeAssetPerformanceOutput = z.infer<typeof SummarizeAssetPerformanceOutputSchema>;

export async function summarizeAssetPerformance(input: SummarizeAssetPerformanceInput): Promise<SummarizeAssetPerformanceOutput> {
  return summarizeAssetPerformanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeAssetPerformancePrompt',
  model: geminiModel,
  input: { schema: SummarizeAssetPerformanceInputSchema },
  output: { schema: SummarizeAssetPerformanceOutputSchema },
  prompt: `Você é um analista financeiro que cria resumos rápidos sobre o desempenho de ativos.
Sua tarefa é analisar o histórico de preços de fechamento de um ativo e gerar uma frase curta e informativa.

REGRAS:
1.  **Seja Conciso:** Crie uma única frase.
2.  **Foco no Recente:** Analise a tendência geral do último mês (últimos 21 pregões) e a tendência mais imediata (últimos 2-3 pregões).
3.  **Use Linguagem Natural:** Exemplo: "Em alta de 5% no mês, mas perdeu força nos últimos 2 dias." ou "Estável no mês, com leve queda hoje." ou "Em forte queda de 10% nas últimas semanas.".
4.  **Calcule as Variações:** Baseie sua análise em cálculos percentuais a partir dos dados fornecidos. O primeiro item da lista é o mais recente.

Dados do Ativo:
- Ticker: {{ticker}}
- Histórico de preços de fechamento (do mais recente para o mais antigo):
  {{#each historicalData}}
  - Data: {{date}}, Fechamento: {{close}}
  {{/each}}

Gere o resumo de uma frase para o ativo {{ticker}}.
`,
});

const summarizeAssetPerformanceFlow = ai.defineFlow(
  {
    name: 'summarizeAssetPerformanceFlow',
    inputSchema: SummarizeAssetPerformanceInputSchema,
    outputSchema: SummarizeAssetPerformanceOutputSchema,
  },
  async (input) => {
    // A IA é inteligente o suficiente para lidar com poucos dados, mas podemos garantir que há dados suficientes para uma análise mensal.
    if (input.historicalData.length < 5) {
        return { summary: 'Dados históricos insuficientes para um resumo detalhado.' };
    }
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('A IA não conseguiu gerar um resumo.');
    }
    return output;
  }
);
