'use server';
/**
 * @fileOverview This file defines a Genkit flow that analyzes raw news articles,
 * cross-references them with a user's portfolio and macro-economic topics,
 * and generates a ranked, diversified, and simplified news briefing of up to 5 stories.
 *
 * - generateDailyNewsStories: The main function that orchestrates the news analysis.
 * - GenerateStoriesInput: The input type, containing raw news and user context.
 * - GenerateStoriesOutput: The output type, containing the summarized stories.
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
  imageUrl: z.string().url().optional().describe("A URL de uma imagem representativa da notícia (opcional).")
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
  rawItemsUsedIds: z.array(z.string()).describe("Uma lista dos IDs dos itens de notícias brutas que foram usados para gerar os stories."),
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
  system: `Você é um editor-chefe de notícias financeiras para iniciantes. Sua missão é transformar uma lista de notícias brutas em um briefing diário com ATÉ 5 "stories" relevantes e fáceis de entender.

REGRAS PRINCIPAIS:
1.  **Análise de Relevância:** Analise as 'rawNews'. Priorize notícias que mencionam os 'userAssets' (ativos do usuário) ou temas macroeconômicos importantes para o Brasil (SELIC, Juros, Inflação, IPCA, Dólar, Câmbio, PIB, Política Econômica).
2.  **Seleção e Diversificação:** Escolha as notícias mais importantes, até um máximo de 5. Tente criar um mix equilibrado de assuntos.
3.  **Geração dos Stories:** Para cada notícia escolhida, gere um objeto 'Story' com:
    *   **Título:** Um novo título, curto e impactante (máx 65 caracteres).
    *   **Resumo:** Um resumo em 2-3 frases com linguagem 100% leiga.
    *   **"Por que isso importa?" ('whyItMatters'):** Uma única frase sobre o impacto prático para um investidor iniciante.
    *   **"Impacto Provável" ('likelyImpact'):** Uma frase resumindo quais áreas do mercado a notícia tende a afetar.
    *   **Metadados:** Preencha 'relatedTickers' e 'topics' com os termos detectados, e mantenha 'url', 'source', e 'publishedAt' da notícia original.
4.  **Validação:** Liste os IDs das notícias brutas usadas em 'rawItemsUsedIds'. Use linguagem cautelosa (ex: "pode impactar", "tende a afetar"). Não inclua imagens.`,
  prompt: `
Contexto do Usuário:
- Ativos na carteira: {{#if userAssets}}'{{userAssets}}'{{else}}Nenhum ativo informado.{{/if}}

Notícias brutas do dia:
{{#each rawNews}}
- ID: {{id}}, Título: "{{title}}", Resumo: "{{summary_raw}}"
{{/each}}

Agora, execute a análise e gere o briefing com os stories mais importantes.
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
    // If output is null or stories are empty, return a valid but empty response.
    // This prevents throwing an error that would be caught by the action's generic catch block.
    if (!output) {
        return { stories: [], rawItemsUsedIds: [] };
    }
    return output;
  }
);
