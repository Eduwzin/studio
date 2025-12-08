'use server';
/**
 * @fileOverview Este arquivo define um fluxo Genkit para gerar o conteúdo de uma lição educacional.
 *
 * - `generateLesson`: Função que orquestra a geração do conteúdo da lição.
 * - `GenerateLessonInput`: A definição do tipo de entrada para a função.
 * - `GenerateLessonOutput`: A definição do tipo de saída para a função.
 */

import { ai, geminiPro } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateLessonInputSchema = z.object({
  lessonId: z.string().describe('O ID da lição para a qual gerar conteúdo (ex: l1_f1_o_que_e_investir).'),
  lessonTitle: z.string().describe('O título da lição (ex: O que é investir?).'),
});
export type GenerateLessonInput = z.infer<typeof GenerateLessonInputSchema>;

const QuizQuestionSchema = z.object({
    questionText: z.string().describe("O texto da pergunta do quiz."),
    options: z.array(z.string()).describe("Uma lista de 4 opções de resposta em texto."),
    correctAnswerIndex: z.number().describe("O índice (0 a 3) da resposta correta no array de opções."),
    explanation: z.string().describe("Uma breve explicação do porquê a resposta está correta, no tom do Beagle Investidor.")
});

const GenerateLessonOutputSchema = z.object({
  beagleIntro: z.string().describe("Uma frase curta e motivacional do Beagle Investidor para introduzir a lição, no máximo 2 sentenças."),
  explanation: z.string().describe('Uma explicação didática e simples sobre o tópico da lição, com no máximo 3 parágrafos curtos. Use exemplos práticos e evite jargões.'),
  quiz: z.array(QuizQuestionSchema).describe("Um array de exatamente 3 perguntas de quiz sobre o conteúdo da lição."),
});
export type GenerateLessonOutput = z.infer<typeof GenerateLessonOutputSchema>;

export async function generateLesson(input: GenerateLessonInput): Promise<GenerateLessonOutput> {
  return generateLessonFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLessonPrompt',
  model: geminiPro,
  input: { schema: GenerateLessonInputSchema },
  output: { schema: GenerateLessonOutputSchema },
  prompt: `Você é o Beagle Investidor, um mentor financeiro amigável, engraçado, motivador e um pouco sarcástico. Sua missão é ensinar iniciantes sobre investimentos de forma simples e divertida.

Gere o conteúdo para a seguinte lição: "{{lessonTitle}}".

Seu tom deve ser sempre direto, informal e otimista. Use o personagem "Beagle Investidor" que definimos.

Siga estritamente as seguintes instruções:

1.  **Introdução do Beagle:** Crie uma introdução curta e impactante para a lição.
2.  **Explicação:** Explique o tópico da lição de forma super simples. Use analogias e exemplos do dia a dia. Não use mais de 3 parágrafos.
3.  **Quiz:** Crie exatamente 3 perguntas de múltipla escolha sobre o conteúdo que você explicou. As perguntas devem ser inteligentes, mas justas para um iniciante. Cada pergunta deve ter 4 opções. Para cada pergunta, forneça a explicação da resposta correta no tom do Beagle.`,
});

const generateLessonFlow = ai.defineFlow(
  {
    name: 'generateLessonFlow',
    inputSchema: GenerateLessonInputSchema,
    outputSchema: GenerateLessonOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
