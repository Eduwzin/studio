'use server';
/**
 * @fileoverview Fluxo para importar dados de informes mensais de FIIs da CVM.
 *
 * - syncCvmFiis - Função principal que orquestra o processo de importação.
 * - SyncCvmFiisInput - O tipo de entrada para o fluxo.
 * - SyncCvmFiisOutput - O tipo de retorno para o fluxo.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as admin from 'firebase-admin';
import { Storage } from '@google-cloud/storage';
import fetch from 'node-fetch';
import JSZip from 'jszip';
import Papa from 'papaparse';

// Definição dos Schemas de Entrada e Saída com Zod
export const SyncCvmFiisInputSchema = z.object({
  year: z.number().describe('O ano para o qual os dados devem ser importados.'),
  sourceUrl: z.string().url().describe('A URL completa para o arquivo ZIP da CVM.'),
});
export type SyncCvmFiisInput = z.infer<typeof SyncCvmFiisInputSchema>;

export const SyncCvmFiisOutputSchema = z.object({
  status: z.enum(['SUCCESS', 'FAILED', 'EMPTY']).describe('O status final da importação.'),
  message: z.string().describe('Uma mensagem descrevendo o resultado.'),
  importedCount: z.number().describe('A quantidade de registros de FIIs importados.'),
  storagePath: z.string().optional().describe('O caminho para o arquivo ZIP salvo no Cloud Storage.'),
});
export type SyncCvmFiisOutput = z.infer<typeof SyncCvmFiisOutputSchema>;

// Definição do tipo para os dados padronizados do FII
type FiiCvmData = {
    id: string; // CNPJ-YYYY-MM
    cnpj: string;
    nomeFundo: string;
    dataReferencia: string; // YYYY-MM-DD
    patrimonioLiquido: number;
    valorPatrimonialCota: number;
    quantidadeCotas: number;
    rendimentosMes: number | null;
    lastUpdated: admin.firestore.FieldValue;
};

// Função de download
async function downloadZipFile(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Falha no download do arquivo: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// Função para salvar no Cloud Storage
async function saveToStorage(buffer: Buffer, year: number, storage: Storage, bucketName: string): Promise<string> {
  const fileName = `cvm-fii-reports-${year}-${new Date().toISOString()}.zip`;
  const filePath = `raw-cvm-data/${fileName}`;
  const file = storage.bucket(bucketName).file(filePath);
  
  await file.save(buffer, {
    metadata: {
      contentType: 'application/zip',
    },
  });
  
  return `gs://${bucketName}/${filePath}`;
}

// Função de extração do ZIP
async function extractCsvFromZip(buffer: Buffer): Promise<string> {
  const zip = await JSZip.loadAsync(buffer);
  const csvFile = Object.keys(zip.files).find(name => name.startsWith('inf_mensal_fii_geral_') && name.endsWith('.csv'));

  if (!csvFile) {
    throw new Error('Nenhum arquivo CSV de informe mensal encontrado no ZIP.');
  }

  const csvContent = await zip.files[csvFile].async('string');
  return csvContent;
}

// Função de leitura e parse do CSV
function parseCsvContent(csvContent: string): any[] {
  const { data, errors } = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    delimiter: ';',
    encoding: 'latin1', // A CVM usa essa codificação
  });

  if (errors.length > 0) {
    console.warn('Erros de parsing no CSV:', errors);
  }

  return data;
}

// Função de padronização dos dados
function normalizeFiisData(records: any[]): FiiCvmData[] {
  const normalizedData: FiiCvmData[] = [];

  for (const record of records) {
    // Fallbacks para nomes de coluna
    const cnpj = record.CNPJ_FUNDO;
    const dataReferencia = record.DT_COMPTC;
    const nomeFundo = record.DENOM_SOCIAL;
    const patrimonioLiquido = parseFloat(record.VL_PATRIM_LIQ) || 0;
    const valorPatrimonialCota = parseFloat(record.VL_QUOTA) || 0;
    const quantidadeCotas = parseInt(record.NR_COTST, 10) || parseInt(record.QTD_COTA_EMIT, 10) || 0;
    const rendimentosMes = parseFloat(record.VL_REND_DIST) || parseFloat(record.REND_DIST_COTA) || null;

    if (!cnpj || !dataReferencia) {
        continue; // Pula registros sem CNPJ ou data
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
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  return normalizedData;
}

// Função de persistência no Firestore
async function saveFiisToFirestore(fiis: FiiCvmData[], db: admin.firestore.Firestore): Promise<number> {
    if (fiis.length === 0) return 0;

    const collectionRef = db.collection('fii-reports-cvm');
    const batchSize = 500; // Limite do Firestore por batch
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

// Função exportada que pode ser chamada por outros componentes
export async function syncCvmFiis(input: SyncCvmFiisInput): Promise<SyncCvmFiisOutput> {
  return syncCvmFiisFlow(input);
}

// Definição do Flow principal
const syncCvmFiisFlow = ai.defineFlow(
  {
    name: 'syncCvmFiisFlow',
    inputSchema: SyncCvmFiisInputSchema,
    outputSchema: SyncCvmFiisOutputSchema,
  },
  async ({ year, sourceUrl }) => {
    // Inicialização do Firebase Admin (evita múltiplas inicializações)
    if (!admin.apps.length) {
      admin.initializeApp();
    }
    const db = admin.firestore();
    const storage = new Storage();
    const BUCKET_NAME = process.env.GCLOUD_STORAGE_BUCKET || `${process.env.GCP_PROJECT}-bucket`;

    try {
      console.log(`Iniciando importação da CVM para o ano ${year}...`);

      // 1. Download
      const zipBuffer = await downloadZipFile(sourceUrl);
      console.log('Download do ZIP concluído.');

      // 2. Salvar no Storage
      const storagePath = await saveToStorage(zipBuffer, year, storage, BUCKET_NAME);
      console.log(`ZIP salvo em: ${storagePath}`);

      // 3. Extrair CSV
      const csvContent = await extractCsvFromZip(zipBuffer);
      console.log('Extração do CSV concluída.');

      // 4. Ler CSV
      const records = parseCsvContent(csvContent);
      if (records.length === 0) {
        return {
          status: 'EMPTY',
          message: 'O arquivo CSV estava vazio ou não pôde ser lido.',
          importedCount: 0,
          storagePath,
        };
      }
      console.log(`${records.length} registros lidos do CSV.`);

      // 5. Padronizar Dados
      const normalizedData = normalizeFiisData(records);
      console.log(`${normalizedData.length} registros padronizados.`);

      // 6. Salvar no Firestore
      const importedCount = await saveFiisToFirestore(normalizedData, db);
      console.log(`${importedCount} registros salvos no Firestore.`);

      // 7. Retornar resultado
      return {
        status: 'SUCCESS',
        message: `Importação concluída com sucesso para o ano ${year}.`,
        importedCount,
        storagePath,
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
