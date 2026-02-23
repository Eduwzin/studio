'use server';
/**
 * @fileOverview Este arquivo define um fluxo Genkit para um chat de perguntas e respostas.
 * O fluxo atua como um analista de investimentos que pode responder a perguntas
 * sobre o mercado financeiro, usando o perfil do investidor e dados macroeconômicos como contexto.
 *
 * - chatWithMarketAnalyst: A função principal que executa a conversa.
 * - ChatInput: O tipo de entrada, contendo a pergunta do usuário e o histórico da conversa.
 * - ChatOutput: O tipo de saída, contendo a resposta da IA.
 */

import { ai, geminiModel } from '@/ai/genkit';
import { z } from 'genkit';

// Esquema para cada mensagem no histórico do chat
const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

// Esquema de entrada para o fluxo de chat
const ChatInputSchema = z.object({
  userProfile: z.string().describe("Um resumo do perfil de risco e horizonte de investimento do usuário."),
  marketContext: z.string().describe("Um resumo do cenário macroeconômico atual (SELIC, IPCA, IBOV, etc.)."),
  history: z.array(ChatMessageSchema).describe("O histórico da conversa até o momento."),
  question: z.string().describe("A nova pergunta do usuário."),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

// Esquema de saída para a resposta da IA
const ChatOutputSchema = z.object({
  answer: z.string().describe("A resposta do analista de IA para a pergunta do usuário."),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

// Função exportada que os componentes do Next.js chamarão
export async function chatWithMarketAnalyst(input: ChatInput): Promise<ChatOutput> {
  return chatAnalystFlow(input);
}

// Definição do prompt da IA
const chatPrompt = ai.definePrompt({
  name: 'chatWithMarketAnalystPrompt',
  model: geminiModel,
  input: { schema: ChatInputSchema },
  output: { schema: ChatOutputSchema },
  prompt: `Você é um Analista de Investimentos Sênior (CNPI) e está conversando com um investidor iniciante. Sua missão é responder às perguntas dele de forma clara, didática e direta.

REGRAS:
1.  **Use o Contexto:** Baseie suas respostas firmemente no perfil do investidor e no cenário de mercado fornecidos. Não invente dados.
2.  **Tom Amigável e Profissional:** Seja encorajador e acessível, mas mantenha a precisão de um especialista. Evite jargões complexos. Se precisar usar um termo técnico, explique-o brevemente.
3.  **Respostas Curtas:** Forneça respostas concisas e focadas na pergunta do usuário. Evite ser prolixo.
4.  **Não é Recomendação de Compra:** NUNCA faça uma recomendação direta de compra ou venda de um ativo específico. Em vez disso, explique os conceitos e os prós e contras para que o usuário possa tomar sua própria decisão.
5.  **Mantenha o Histórico:** Leve em conta as perguntas e respostas anteriores para dar continuidade à conversa de forma coesa.

Contexto para a sua análise:

## Perfil do Investidor
{{{userProfile}}}

## Cenário Macroeconômico
{{{marketContext}}}

## Histórico da Conversa
{{#each history}}
  **{{role}}**: {{content}}
{{/each}}

## Nova Pergunta do Usuário
**user**: {{{question}}}

**model**:
`,
});

// Definição do fluxo Genkit
const chatAnalystFlow = ai.defineFlow(
  {
    name: 'chatAnalystFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const { output } = await chatPrompt(input);
    if (!output) {
      throw new Error('A IA não conseguiu gerar uma resposta.');
    }
    return output;
  }
);
