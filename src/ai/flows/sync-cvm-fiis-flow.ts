'use server';
/**
 * @fileoverview Fluxo para importar dados de FIIs da CVM a partir de um arquivo ZIP enviado via upload.
 *
 * - syncCvmFiis - Função principal que orquestra o processo de importação.
 * - SyncCvmFiisInput - O tipo de entrada para o fluxo (nome do arquivo e conteúdo em Base64).
 * - SyncCvmFiisOutput - O tipo de saída, com o status da operação.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import Papa from 'papaparse';
import type { FieldValue } from 'firebase-admin/firestore';

// Define o novo schema de entrada, esperando o conteúdo do arquivo
const SyncCvmFiisInputSchema = z.object({
  fileName: z.string().describe('O nome original do arquivo ZIP enviado.'),
  fileContent: z.string().describe('O conteúdo do arquivo ZIP como uma string Data URL (Base64).'),
});

const SyncCvmFiisOutputSchema = z.object({
  status: z.enum(['SUCCESS', 'FAILED', 'EMPTY']).describe('O status final da importação.'),
  message: z.string().describe('Uma mensagem descrevendo o resultado.'),
  importedCount: z.number().describe('A quantidade de registros de FIIs importados.'),
});

export type SyncCvmFiisInput = z.infer<typeof SyncCvmFiisInputSchema>;
export type SyncCvmFiisOutput = z.infer<typeof SyncCvmFiisOutputSchema>;

type FiiCvmData = {
  id: string;
  cnpj: string;
  nomeFundo: string;
  dataReferencia: string;
  patrimonioLiquido: number;
  valorPatrimonialCota: number;
  quantidadeCotas: number;
  rendimentosMes: number | null;
  lastUpdated: FieldValue; // Firestore FieldValue
};

async function extractCsvFromZip(fileContent: string): Promise<string> {
    const JSZip = (await import('jszip')).default;

    // Converte a string Data URL (Base64) para um Buffer
    const zipBuffer = Buffer.from(fileContent.substring(fileContent.indexOf(',') + 1), 'base64');
    
    console.log('Arquivo ZIP carregado em memória. Extraindo conteúdo...');
    const zip = await JSZip.loadAsync(zipBuffer);
    
    const csvFileName = Object.keys(zip.files).find(name => name.toLowerCase().endsWith('.csv'));
    
    if (!csvFileName) {
        throw new Error('Nenhum arquivo CSV encontrado no ZIP.');
    }
    
    console.log(`Arquivo CSV encontrado: ${csvFileName}. Lendo conteúdo...`);
    const csvContent = await zip.files[csvFileName].async('string');
    return csvContent;
}

function parseCsvContent(csvContent: string): any[] {
  const { data, errors } = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    delimiter: ';',
    encoding: 'latin1',
  });

  if (errors.length > 0) {
    console.warn('Erros de parsing no CSV:', errors);
  }
  return data;
}

function normalizeFiisData(records: any[], serverTimestamp: FieldValue): FiiCvmData[] {
  const normalizedData: FiiCvmData[] = [];

  for (const record of records) {
    const cnpj = record.CNPJ_FUNDO;
    const dataReferencia = record.DT_COMPTC;
    const nomeFundo = record.DENOM_SOCIAL;
    const patrimonioLiquido = parseFloat(record.VL_PATRIM_LIQ) || 0;
    const valorPatrimonialCota = parseFloat(record.VL_QUOTA) || 0;
    const quantidadeCotas = parseInt(record.NR_COTST, 10) || parseInt(record.QTD_COTA_EMIT, 10) || 0;
    const rendimentosMes = parseFloat(record.VL_REND_DIST) || parseFloat(record.REND_DIST_COTA) || null;

    if (!cnpj || !dataReferencia) {
        continue;
    }
    
    const [year, month] = dataReferencia.split('-');
    const id = `${cnpj}-${year}-${month}`;

    normalizedData.push({
      id,
      cnpj,
      nomeFundo,
      dataReferencia,
      patrimonioLiquido,
      valorPatrimonialCota,
      quantidadeCotas,
      rendimentosMes,
      lastUpdated: serverTimestamp,
    });
  }
  return normalizedData;
}

async function saveFiisToFirestore(fiis: FiiCvmData[], db: any): Promise<number> {
    if (fiis.length === 0) return 0;

    const collectionRef = db.collection('fii-reports-cvm');
    const batchSize = 500;
    let importedCount = 0;

    for (let i = 0; i < fiis.length; i += batchSize) {
        const batch = db.batch();
        const chunk = fiis.slice(i, i + batchSize);
        chunk.forEach(fii => {
            const docRef = collectionRef.doc(fii.id);
            batch.set(docRef, fii, { merge: true });
        });
        await batch.commit();
        importedCount += chunk.length;
    }
    
    return importedCount;
}

export async function syncCvmFiis(input: SyncCvmFiisInput): Promise<SyncCvmFiisOutput> {
  return syncCvmFiisFlow(input);
}

const syncCvmFiisFlow = ai.defineFlow(
  {
    name: 'syncCvmFiisFlow',
    inputSchema: SyncCvmFiisInputSchema,
    outputSchema: SyncCvmFiisOutputSchema,
  },
  async ({ fileName, fileContent }) => {
    try {
      console.log(`Iniciando importação do arquivo '${fileName}' via upload...`);

      const csvContent = await extractCsvFromZip(fileContent);
      console.log('Extração do arquivo CSV do ZIP concluída.');
      
      const records = parseCsvContent(csvContent);
      if (records.length === 0) {
        return {
          status: 'EMPTY',
          message: 'O arquivo CSV estava vazio ou não pôde ser lido.',
          importedCount: 0,
        };
      }
      console.log(`${records.length} registros lidos do CSV.`);
      
      // Dynamically import admin SDK only when needed
      const { initializeApp, getApps } = await import('firebase-admin/app');
      const { getFirestore, FieldValue } = await import('firebase-admin/firestore');
      
      if (!getApps().length) {
        initializeApp(); // Automatically uses env vars on Google Cloud
      }
      const db = getFirestore();

      const normalizedData = normalizeFiisData(records, FieldValue.serverTimestamp());
      console.log(`${normalizedData.length} registros padronizados.`);

      const importedCount = await saveFiisToFirestore(normalizedData, db);
      console.log(`${importedCount} registros salvos no Firestore.`);

      return {
        status: 'SUCCESS',
        message: `Importação do arquivo '${fileName}' concluída com sucesso.`,
        importedCount,
      };

    } catch (error: any) {
      console.error('Erro durante o fluxo de importação da CVM:', error);
      return {
        status: 'FAILED',
        message: error.message || 'Ocorreu um erro desconhecido durante o fluxo.',
        importedCount: 0,
      };
    }
  }
);
