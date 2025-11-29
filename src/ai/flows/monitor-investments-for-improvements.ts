'use server';

/**
 * @fileOverview Um agente de IA que monitora investimentos e sugere melhorias com base na mudança de dados do mercado.
 *
 * - monitorInvestmentsForImprovements - Uma função que inicia o processo de monitoramento de investimentos.
 * - MonitorInvestmentsForImprovementsInput - O tipo de entrada para a função monitorInvestmentsForImprovements.
 * - MonitorInvestmentsForImprovementsOutput - O tipo de retorno para a função monitorInvestmentsForImprovements.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MonitorInvestmentsForImprovementsInputSchema = z.object({
  portfolio: z.string().describe('O portfólio de investimentos atual do usuário.'),
  marketData: z.string().describe('Os dados mais recentes do mercado a serem analisados.'),
  userRiskProfile: z.string().describe('O perfil de risco do usuário.'),
});
export type MonitorInvestmentsForImprovementsInput = z.infer<
  typeof MonitorInvestmentsForImprovementsInputSchema
>;

const MonitorInvestmentsForImprovementsOutputSchema = z.object({
  suggestedImprovements: z
    .string()
    .describe('As melhorias sugeridas para o portfólio de investimentos.'),
  rationale: z
    .string()
    .describe('A justificativa por trás das melhorias sugeridas.'),
});
export type MonitorInvestmentsForImprovementsOutput = z.infer<
  typeof MonitorInvestmentsForImprovementsOutputSchema
>;

export async function monitorInvestmentsForImprovements(
  input: MonitorInvestmentsForImprovementsInput
): Promise<MonitorInvestmentsForImprovementsOutput> {
  return monitorInvestmentsForImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'monitorInvestmentsForImprovementsPrompt',
  input: {schema: MonitorInvestmentsForImprovementsInputSchema},
  output: {schema: MonitorInvestmentsForImprovementsOutputSchema},
  prompt: `Você é um consultor de investimentos de IA encarregado de monitorar portfólios de investimentos e sugerir melhorias com base nos dados do mercado e no perfil de risco do usuário.\n\nAnalise o portfólio de investimentos atual, os dados mais recentes do mercado e o perfil de risco do usuário para identificar possíveis melhorias e otimizações.\n\nPortfólio de Investimentos Atual: {{{portfolio}}}\nDados de Mercado Mais Recentes: {{{marketData}}}\nPerfil de Risco do Usuário: {{{userRiskProfile}}}\n\nCom base em sua análise, forneça sugestões específicas de melhorias para o portfólio, juntamente com uma justificativa clara para cada sugestão.\n\nConsidere fatores como diversificação, retornos ajustados ao risco e alinhamento com as metas de investimento do usuário.\n\n{{output}}`,
});

const monitorInvestmentsForImprovementsFlow = ai.defineFlow(
  {
    name: 'monitorInvestmentsForImprovementsFlow',
    inputSchema: MonitorInvestmentsForImprovementsInputSchema,
    outputSchema: MonitorInvestmentsForImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
