'use server';
/**
 * @fileOverview This file defines a Genkit flow that analyzes raw news articles,
 * cross-references them with a user's portfolio and macro-economic topics,
 * and generates a ranked, diversified, and simplified 5-story news briefing.
 *
 * - generateDailyNewsStories: The main function that orchestrates the news analysis.
 * - GenerateStoriesInput: The input type, containing raw news and user context.
 * - GenerateStoriesOutput: The output type, containing the 5 summarized stories.
 */

import { ai, geminiPro } from '@/ai/genkit';
import { z } from 'genkit';

// 2. Schema for the final, summarized story format
const StorySchema = z.object({
  title: z.string().max(65).describe("Um título curto e direto para o story (máximo 65 caracteres)."),
  summary: z.string().describe("O resumo da notícia em linguagem simples e didática (2-3 frases)."),
  whyItMatters: z.string().describe("Explicação de por que a notícia é importante para um investidor iniciante (1 frase)."),
  likelyImpact: z.string().describe("O impacto provável no mercado (ex: 'tende a mexer em dólar/bolsa/juros')."),
  url: z.string().url().describe("A URL original da notícia."),
  source: z.string().describe("O nome da fonte da notícia (ex: 'g1', 'InfoMoney')."),
  publishedAt: z.string().describe("A data de publicação original no formato ISO."),
  relatedTickers: z.array(z.string()).describe("Lista de tickers de ativos (se houver) mencionados diretamente na notícia."),
  topics: z.array(z.string()).describe("Lista de tópicos macroeconômicos detectados (ex: 'SELIC', 'Câmbio')."),
});

// 1. Schema for the input data to the flow
const GenerateStoriesInputSchema = z.object({
  rawNews: z.array(z.object({
    id: z.string(),
    title: z.string(),
    summary_raw: z.string(),
    url: z.string().url(),
    source: z.string(),
    publishedAt: z.string(),
  })).describe("Uma lista de notícias brutas, já pré-filtradas e normalizadas."),
  userAssets: z.string().describe("Uma string separada por vírgulas com os tickers dos ativos da carteira do usuário (ex: 'PETR4,VALE3,MXRF11'). Pode ser vazia."),
});
export type GenerateStoriesInput = z.infer<typeof GenerateStoriesInputSchema>;

// 3. Schema for the final output of the flow
const GenerateStoriesOutputSchema = z.object({
  stories: z.array(StorySchema).describe("Uma lista de até 5 stories de notícias, rankeadas e diversificadas."),
  rawItemsUsedIds: z.array(z.string()).describe("Uma lista dos IDs dos itens de notícias brutas que foram usados para gerar os 5 stories."),
});
export type GenerateStoriesOutput = z.infer<typeof GenerateStoriesOutputSchema>;

// Exporting for client-side usage, matches the StorySchema
export type NewsStory = z.infer<typeof StorySchema>;

// 4. Exported function for Next.js components to call
export async function generateDailyNewsStories(input: GenerateStoriesInput): Promise<GenerateStoriesOutput> {
  return newsAnalysisFlow(input);
}

// 5. The Genkit Prompt Definition
const newsAnalysisPrompt = ai.definePrompt({
  name: 'dailyNewsAnalysisPrompt',
  model: geminiPro,
  input: { schema: GenerateStoriesInputSchema },
  output: { schema: GenerateStoriesOutputSchema },
  system: `Você é um editor-chefe de um portal de notícias financeiras para iniciantes, o SafeStart Invest. Sua missão é transformar uma lista de notícias brutas em um briefing diário de 5 "stories" inteligentes, relevantes e fáceis de entender.

Siga este processo rigorosamente:

1.  **Análise de Relevância:**
    *   Primeiro, analise a lista de 'rawNews'.
    *   **Contexto do Usuário:** A string 'userAssets' contém os ativos da carteira do usuário. Notícias que mencionam diretamente esses tickers (ou nomes de empresas relacionadas) são MUITO importantes.
    *   **Contexto Macro:** Identifique notícias que abordam temas macroeconômicos cruciais para o mercado brasileiro: 'SELIC', 'Juros', 'Copom', 'Inflação', 'IPCA', 'Dólar', 'Câmbio', 'PIB', 'Petróleo', 'Minério de Ferro', 'Política Econômica', 'Impostos'. Notícias sobre o Fed (EUA) e a economia da China também são importantes.
    *   **Ranking:** Crie um ranking mental das notícias. O critério de maior peso é a menção direta a um ativo do usuário. O segundo maior peso são os temas macro. Recência é o terceiro critério.

2.  **Seleção e Diversificação:**
    *   Escolha as 5 notícias mais importantes do seu ranking.
    *   **Regra de Diversidade:** Garanta que os 5 stories não sejam todos sobre o mesmo assunto. Tente criar um mix equilibrado, como por exemplo: 1 sobre juros/inflação, 1 sobre câmbio/commodities, 1 sobre uma empresa específica (idealmente da carteira do usuário), 1 sobre o cenário global (EUA/China) e 1 de "insight geral".

3.  **Geração dos Stories:**
    *   Para cada uma das 5 notícias selecionadas, gere um objeto 'Story' seguindo as regras abaixo.
    *   **Título:** Crie um novo título, curto e impactante (máx 65 caracteres).
    *   **Resumo:** Reescreva o conteúdo em 2-3 frases, usando linguagem 100% leiga. Zero "economês".
    *   **"Por que isso importa?":** Escreva uma única frase explicando o impacto prático para um investidor iniciante. (campo 'whyItMatters')
    *   **"Impacto Provável":** Resuma em uma frase quais áreas do mercado a notícia tende a afetar. (campo 'likelyImpact')
    *   **Metadados:** Preencha 'relatedTickers' e 'topics' com os termos que você detectou. Mantenha os campos 'url', 'source' e 'publishedAt' da notícia original.

4.  **Validação Final:**
    *   Certifique-se de que a saída contém exatamente 5 stories.
    *   Liste os IDs das notícias brutas originais que você usou no campo 'rawItemsUsedIds'.
    *   NUNCA dê conselhos de investimento ou faça previsões certeiras. Use linguagem como "pode impactar", "tende a afetar", "investidores estão de olho em".`,
  prompt: `
Contexto do Usuário:
- Ativos na carteira: {{#if userAssets}}'{{userAssets}}'{{else}}Nenhum ativo informado.{{/if}}

Notícias brutas do dia:
{{#each rawNews}}
- ID: {{id}}, Título: "{{title}}", Resumo: "{{summary_raw}}"
{{/each}}

Agora, execute a análise e gere o briefing com 5 stories.
`,
});

// 6. The Genkit Flow Definition
const newsAnalysisFlow = ai.defineFlow(
  {
    name: 'newsAnalysisFlow',
    inputSchema: GenerateStoriesInputSchema,
    outputSchema: GenerateStoriesOutputSchema,
  },
  async (input) => {
    const { output } = await newsAnalysisPrompt(input);
    if (!output || output.stories.length === 0) {
      throw new Error('A IA não conseguiu gerar o briefing de notícias.');
    }
    return output;
  }
);
