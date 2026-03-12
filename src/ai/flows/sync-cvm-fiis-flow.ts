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
// Admin SDK and Storage will be imported dynamically
import { Storage } from '@google-cloud/storage';
import fetch from 'node-fetch';
import JSZip from 'jszip';
import Papa from 'papaparse';

// Schema definition remains internal to the server file
const SyncCvmFiisInputSchema = z.object({
  year: z.number().describe('O ano para o qual os dados devem ser importados.'),
  sourceUrl: z.string().url().describe('A URL completa para o arquivo ZIP da CVM.'),
});

const SyncCvmFiisOutputSchema = z.object({
  status: z.enum(['SUCCESS', 'FAILED', 'EMPTY']).describe('O status final da importação.'),
  message: z.string().describe('Uma mensagem descrevendo o resultado.'),
  importedCount: z.number().describe('A quantidade de registros de FIIs importados.'),
  storagePath: z.string().optional().describe('O caminho para o arquivo ZIP salvo no Cloud Storage.'),
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
    lastUpdated: any; // Firestore FieldValue
};

async function downloadZipFile(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Falha no download do arquivo (${response.status}): ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

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

async function extractCsvFromZip(buffer: Buffer): Promise<string> {
  const zip = await JSZip.loadAsync(buffer);
  const csvFile = Object.keys(zip.files).find(name => name.startsWith('inf_mensal_fii_geral_') && name.endsWith('.csv'));

  if (!csvFile) {
    throw new Error('Nenhum arquivo CSV de informe mensal encontrado no ZIP.');
  }

  const csvContent = await zip.files[csvFile].async('string');
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

function normalizeFiisData(records: any[], serverTimestamp: any): FiiCvmData[] {
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
  async ({ year, sourceUrl }) => {
    // Dynamically import admin SDK to ensure it's only loaded in a server environment
    const admin = await import('firebase-admin');

    if (!admin.apps.length) {
      admin.initializeApp();
    }
    const db = admin.firestore();
    const storage = new Storage();
    const BUCKET_NAME = process.env.GCLOUD_STORAGE_BUCKET || `${process.env.GCP_PROJECT}-bucket`;

    try {
      console.log(`Iniciando importação da CVM para o ano ${year}...`);

      const zipBuffer = await downloadZipFile(sourceUrl);
      console.log('Download do ZIP concluído.');

      const storagePath = await saveToStorage(zipBuffer, year, storage, BUCKET_NAME);
      console.log(`ZIP salvo em: ${storagePath}`);

      const csvContent = await extractCsvFromZip(zipBuffer);
      console.log('Extração do CSV concluída.');

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

      const normalizedData = normalizeFiisData(records, admin.firestore.FieldValue.serverTimestamp());
      console.log(`${normalizedData.length} registros padronizados.`);

      const importedCount = await saveFiisToFirestore(normalizedData, db);
      console.log(`${importedCount} registros salvos no Firestore.`);

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
