'use server';
/**
 * @fileOverview Este arquivo define um fluxo Genkit para analisar o perfil, a tolerância ao risco e as metas financeiras de um usuário para criar uma estratégia de investimento personalizada.
 *
 * - analyzeUserProfile - Uma função que aciona o fluxo de análise do perfil do usuário.
 * - AnalyzeUserProfileInput - O tipo de entrada para a função analyzeUserProfile.
 * - AnalyzeUserProfileOutput - O tipo de saída para a função analyzeUserProfile.
 */

import {ai, geminiModel} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeUserProfileInputSchema = z.object({
  age: z.number().describe('A idade do usuário. Se não fornecido, pode ser ignorado.'),
  riskTolerance: z
    .string()
    .describe(
      'A tolerância ao risco do usuário (por exemplo, baixa, média, alta). Se não fornecido, pode ser ignorado.'
    ),
  financialGoals: z
    .string()
    .describe(
      'As metas financeiras do usuário (por exemplo, aposentadoria, comprar uma casa, economizar para educação). Se não fornecido, pode ser ignorado.'
    ),
  investmentExperience: z
    .string()
    .describe(
      'Este é o input mais importante. Contém as respostas do usuário a um questionário detalhado sobre seu perfil. Analise-o cuidadosamente.'
    ),
  income: z.number().describe('A renda anual do usuário. Se não fornecido, pode ser ignorado.'),
  investmentAmount: z.number().describe('O valor total que o usuário deseja investir. Se não fornecido, pode ser ignorado.'),
});
export type AnalyzeUserProfileInput = z.infer<typeof AnalyzeUserProfileInputSchema>;

const AnalyzeUserProfileOutputSchema = z.object({
  estrategiaDeInvestimento: z
    .string()
    .describe('Uma estratégia de investimento personalizada e adaptada ao usuário em uma única frase ou sentença curta.'),
  alocacaoDeAtivos: z
    .string()
    .describe(
      "A alocação de ativos recomendada em uma string simples, separada por vírgulas, com pares de nome, porcentagem e exemplos práticos. Exemplo: 'Renda Fixa (ex: Tesouro Selic, CDBs): 70%, Ações Brasil (ex: BOVA11): 20%, Ativos Internacionais (ex: IVVB11): 10%'"
    ),
  avaliacaoDeRisco: z
    .string()
    .describe('Uma avaliação do perfil de risco do usuário com base nos dados fornecidos, resultando em uma única palavra: Conservador, Moderado ou Arrojado.'),
});
export type AnalyzeUserProfileOutput = z.infer<typeof AnalyzeUserProfileOutputSchema>;

export async function analyzeUserProfile(input: AnalyzeUserProfileInput): Promise<AnalyzeUserProfileOutput> {
  return analyzeUserProfileFlow(input);
}

const analyzeUserProfilePrompt = ai.definePrompt({
  name: 'analyzeUserProfilePrompt',
  model: geminiModel,
  input: {schema: AnalyzeUserProfileInputSchema},
  output: {schema: AnalyzeUserProfileOutputSchema},
  prompt: `Você é um consultor de investimentos especialista. Analise o perfil do usuário, incluindo idade e respostas ao questionário, para fornecer uma estratégia de investimento, alocação de ativos e avaliação de risco.

Idade do Usuário: {{age}}
Respostas do Questionário do Usuário:
{{{investmentExperience}}}

Com base nessas informações, forneça o seguinte:

1.  **Estratégia de Investimento:** Uma estratégia de investimento detalhada e acionável, adequada para o perfil identificado, resumida em uma única frase.
2.  **Alocação de Ativos:** Uma alocação de ativos recomendada em porcentagens, como uma string separada por vírgulas. **Para cada classe de ativo, inclua exemplos práticos entre parênteses**. Exemplo: 'Renda Fixa (ex: Tesouro Selic, CDBs): 70%, Ações Brasil (ex: BOVA11): 20%, Ativos Internacionais (ex: IVVB11): 10%'.
3.  **Avaliação de Risco:** Classifique o perfil de risco do usuário em UMA das três categorias: Conservador, Moderado ou Arrojado.

Faça a estratégia de investimento e a alocação de ativos apropriadas para um investidor iniciante, explicando o porquê da sua recomendação. A saída deve ser concisa e direta ao ponto.`,
});

const analyzeUserProfileFlow = ai.defineFlow(
  {
    name: 'analyzeUserProfileFlow',
    inputSchema: AnalyzeUserProfileInputSchema,
    outputSchema: AnalyzeUserProfileOutputSchema,
  },
  async input => {
    const {output} = await analyzeUserProfilePrompt(input);
    return output!;
  }
);
