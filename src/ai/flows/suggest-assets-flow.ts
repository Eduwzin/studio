'use server';
/**
 * @fileOverview Este arquivo define um fluxo Genkit para sugerir ativos específicos
 * (Ações, FIIs, ETFs) com base no perfil do investidor e em uma análise de mercado,
 * utilizando uma ferramenta para buscar dados de ativos em tempo real.
 *
 * - suggestAssets: A função principal que executa o fluxo de sugestão.
 * - SuggestAssetsInput: O tipo de entrada para a função.
 * - SuggestAssetsOutput: O tipo de saída, contendo uma lista de ativos sugeridos.
 */

import { ai, geminiModel } from '@/ai/genkit';
import { getStockInfoFromBrapi } from '@/ai/tools/get-stock-info-from-brapi';
import { z } from 'genkit';

// Esquema de entrada que combina o perfil do usuário e a análise de mercado
const SuggestAssetsInputSchema = z.object({
  riskProfile: z.string().describe("O perfil de risco do investidor (ex: Conservador, Moderado, Arrojado)."),
  marketAnalysis: z.string().describe("A análise macroeconômica e a recomendação de alocação de aporte (ex: 'Cenário detectado: Pró-juros em queda. Justificativa: Com a inflação controlada e a Selic projetada para baixar, o momento é favorável para ativos de risco, especialmente no setor de varejo e construção.')"),
  availableStocks: z.array(z.string()).describe("A lista de tickers de ações disponíveis para sugestão."),
  availableFiis: z.array(z.string()).describe("A lista de tickers de FIIs disponíveis para sugestão."),
  availableEtfs: z.array(z.string()).describe("A lista de tickers de ETFs/BDRs disponíveis para sugestão."),
});
export type SuggestAssetsInput = z.infer<typeof SuggestAssetsInputSchema>;

// Esquema para um único ativo sugerido
const AssetSuggestionSchema = z.object({
    ticker: z.string().describe("O ticker do ativo (ex: 'PETR4', 'MXRF11')."),
    type: z.enum(["Ação", "FII", "ETF"]).describe("O tipo de ativo."),
    name: z.string().describe("O nome do ativo ou da empresa."),
    rationale: z.string().describe("Uma explicação curta e convincente de por que este ativo é uma boa oportunidade para este perfil e cenário."),
});

// Esquema de saída, uma lista de ativos
const SuggestAssetsOutputSchema = z.object({
    suggestions: z.array(AssetSuggestionSchema).describe("Uma lista de até 6 sugestões de ativos, priorizando qualidade sobre quantidade."),
});
export type SuggestAssetsOutput = z.infer<typeof SuggestAssetsOutputSchema>;

// Função exportada que os componentes do Next.js chamarão
export async function suggestAssets(input: SuggestAssetsInput): Promise<SuggestAssetsOutput> {
  return suggestAssetsFlow(input);
}

// Definição do prompt para a IA
const suggestAssetsPrompt = ai.definePrompt({
  name: 'suggestAssetsPrompt',
  model: geminiModel,
  input: { schema: SuggestAssetsInputSchema },
  output: { schema: SuggestAssetsOutputSchema },
  tools: [getStockInfoFromBrapi], // Disponibiliza a ferramenta para a IA
  prompt: `Você é um analista de investimentos (CNPI) especialista em escolher ativos para investidores de varejo.

Sua tarefa é analisar o perfil do investidor e a recomendação estratégica do "Radar de Mercado" para sugerir ATIVOS ESPECÍFICOS a partir de uma lista pré-definida.

LISTA DE ATIVOS DISPONÍVEIS PARA SUGESTÃO:
- Ações: {{availableStocks}}
- FIIs: {{availableFiis}}
- ETFs/BDRs: {{availableEtfs}}

REGRAS OBRIGATÓRIAS:
1.  **Escolha da Lista:** Você DEVE escolher suas sugestões EXCLUSIVAMENTE da lista de ativos fornecida acima.
2.  **Analise o Cenário:** A 'marketAnalysis' contém a conclusão do Radar de Mercado. Use essa diretriz como sua principal fonte de estratégia. Por exemplo, se a análise indica "Pró-juros em queda", foque em ações de setores que se beneficiam disso (varejo, construção) e FIIs de tijolo da lista.
3.  **Use a Ferramenta:** Para cada ticker que você selecionar da lista, você DEVE usar a ferramenta 'getStockInfoFromBrapi' para buscar dados atualizados. Use os dados retornados (preço, variação, etc.) para fortalecer sua recomendação.
4.  **Foco no Perfil:** Adapte a agressividade das suas sugestões ao 'riskProfile'. Não sugira uma ação de altíssimo risco para um perfil conservador, mesmo que o cenário seja favorável. Para perfis conservadores, mesmo em cenários de risco, sugira ações mais consolidadas ou ETFs da lista.
5.  **Justifique a Escolha:** Para cada ativo, explique em uma frase curta POR QUE ele é uma boa escolha para o cenário E para o perfil atuais. Exemplo: "Com a queda da SELIC, o setor de varejo se beneficia, e MGLU3 é uma opção de maior crescimento para um perfil moderado/arrojado."
6.  **Diversifique as Sugestões:** Forneça até 6 sugestões, tentando variar entre Ações, FIIs e ETFs da lista, se a estratégia permitir. A qualidade é mais importante que a quantidade.

Análise estratégica recebida:
- **Perfil do Investidor:** {{riskProfile}}
- **Diretriz do Radar de Mercado:** "{{marketAnalysis}}"

Com base nisso, escolha os ativos mais adequados da lista, use a ferramenta para buscar dados atuais e gere uma lista de até 6 oportunidades de investimento, focando em qualidade.
`,
});

// Definição do fluxo Genkit
const suggestAssetsFlow = ai.defineFlow(
  {
    name: 'suggestAssetsFlow',
    inputSchema: SuggestAssetsInputSchema,
    outputSchema: SuggestAssetsOutputSchema,
  },
  async (input) => {
    const { output } = await suggestAssetsPrompt(input);
    if (!output) {
      throw new Error('A IA não conseguiu gerar sugestões de ativos.');
    }
    return output;
  }
);
