'use server';
/**
 * @fileOverview This file defines a Genkit flow that analyzes a week's worth of
 * news stories and generates a concise weekly summary for an investor.
 *
 * - summarizeWeeklyNews: The main function that orchestrates the news summary.
 * - SummarizeWeeklyNewsInput: The input type, containing a list of news stories.
 * - SummarizeWeeklyNewsOutput: The output type, containing the summary text.
 */

import { ai, geminiModel } from '@/ai/genkit';
import { z } from 'genkit';

// A slimmed-down version of the NewsStory for the prompt
const StorySchema = z.object({
  title: z.string(),
  summary: z.string(),
  whyItMatters: z.string(),
  likelyImpact: z.string(),
  topics: z.array(z.string()),
});

const SummarizeWeeklyNewsInputSchema = z.object({
  stories: z.array(StorySchema).describe("Uma lista de todas as notícias da semana, já processadas e resumidas."),
});
export type SummarizeWeeklyNewsInput = z.infer<typeof SummarizeWeeklyNewsInputSchema>;

const SummarizeWeeklyNewsOutputSchema = z.object({
  weeklySummary: z.string().describe("Um resumo conciso dos principais acontecimentos da semana para um investidor, em 2-3 parágrafos curtos."),
});
export type SummarizeWeeklyNewsOutput = z.infer<typeof SummarizeWeeklyNewsOutputSchema>;

export async function summarizeWeeklyNews(input: SummarizeWeeklyNewsInput): Promise<SummarizeWeeklyNewsOutput> {
  return weeklyNewsSummaryFlow(input);
}

const weeklyNewsSummaryPrompt = ai.definePrompt({
  name: 'weeklyNewsSummaryPrompt',
  model: geminiModel,
  input: { schema: SummarizeWeeklyNewsInputSchema },
  output: { schema: SummarizeWeeklyNewsOutputSchema },
  prompt: `Você é um editor-chefe de uma newsletter financeira semanal para investidores iniciantes. Sua tarefa é ler todos os resumos de notícias da semana e escrever um parágrafo conciso e informativo sobre "Como foi a semana no mercado".

REGRAS:
1.  **Sintetize, não repita:** Não liste as notícias. Em vez disso, conecte os pontos e identifique os temas principais da semana. Quais foram os grandes movimentos?
2.  **Foco no Essencial:** Concentre-se nos temas mais importantes que impactaram o investidor brasileiro: Juros (SELIC), Inflação (IPCA), Bolsa (Ibovespa) e Dólar.
3.  **Tom Didático:** Use uma linguagem clara e direta. Explique o que aconteceu e por que isso é importante.
4.  **Estrutura:** Comece com uma frase de impacto resumindo o sentimento da semana (ex: "Foi uma semana de otimismo para a bolsa...") e depois detalhe os principais acontecimentos em 2 ou 3 parágrafos curtos.

Notícias da semana para analisar:
{{#each stories}}
- **{{title}}**: {{summary}} (Impacto: {{likelyImpact}}, Tópicos: {{#each topics}}{{.}}, {{/each}})
{{/each}}

Agora, escreva o resumo da semana.
`,
});

const weeklyNewsSummaryFlow = ai.defineFlow(
  {
    name: 'weeklyNewsSummaryFlow',
    inputSchema: SummarizeWeeklyNewsInputSchema,
    outputSchema: SummarizeWeeklyNewsOutputSchema,
  },
  async (input) => {
    if (input.stories.length === 0) {
        return { weeklySummary: "Não houve notícias suficientes na última semana para gerar um resumo." };
    }
    const { output } = await weeklyNewsSummaryPrompt(input);
    if (!output) {
      throw new Error('A IA não conseguiu gerar um resumo semanal.');
    }
    return output;
  }
);
