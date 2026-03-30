/**
 * @fileOverview Cloud Function para sincronizar dados de Tesouro Direto
 * 
 * Esta função:
 * 
 * Pode ser disparada por:
 * - HTTP Request (teste manual)
 * - Cloud Scheduler (automático, ex: diariamente às 18h)
 * 
 * Estrutura no Firestore:
 * /precos-tesouro/{YYYY-MM-DD}
 *   snapshot: TreasuryAssetEntry[]
 *   timestamp: Timestamp
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { chromium } from 'playwright';
import * as cheerio from 'cheerio';

// Inicializar Firebase Admin (automático em Cloud Functions)
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const ANBIMA_URL = 'https://data.anbima.com.br/titulos-publicos/monitoramento-intradiario-de-titulos-publicos-federais';

interface TreasuryAssetEntry {
  Título: string;
  Vencimento: string;
  'Código ISIN': string;
  Provedor: string;
  Horário: string;
  'Fech D-1 (taxa % a.a.)': string;
  'Última taxa (% a.a.)': string;
  'Oferta compra': string;
  'Oferta venda': string;
}

/**
 * Faz scraping da página ANBIMA e retorna HTML
 */
async function scrapeTreasuryPage(): Promise<string | null> {
  let browser;
  try {
    functions.logger.info('📡 Iniciando Playwright para scraping...');
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    functions.logger.info(`🌐 Acessando ${ANBIMA_URL}...`);
    await page.goto(ANBIMA_URL, { waitUntil: 'networkidle', timeout: 30000 });

    // Aguarda pela tabela render
    await page.waitForSelector('table', { timeout: 10000 });

    const content = await page.content();
    functions.logger.info('✓ HTML coletado com sucesso');

    return content;
  } catch (error) {
    functions.logger.error('❌ Erro ao fazer scraping:', error);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Extrai tabela HTML e converte para JSON
 */
async function extractTableFromHtml(htmlContent: string): Promise<TreasuryAssetEntry[] | null> {
  try {
    const $ = cheerio.load(htmlContent);

    // Busca pela tabela
    const table = $('table').first();
    if (table.length === 0) {
      functions.logger.warn('⚠ Nenhuma tabela encontrada no HTML');
      return null;
    }

    // Extrai headers do <thead>
    const thead = table.find('thead');
    if (thead.length === 0) {
      functions.logger.warn('⚠ Nenhum <thead> encontrado na tabela');
      return null;
    }

    const headerRow = thead.find('tr').first();
    if (headerRow.length === 0) {
      functions.logger.warn('⚠ Nenhuma linha de header em <thead>');
      return null;
    }

    // Extrai texto dos headers em ordem
    const headers: string[] = [];
    headerRow.find('th').each((_, el) => {
      const text = $(el).text().trim();
      headers.push(text);
    });

    if (headers.length === 0) {
      functions.logger.warn('⚠ Nenhum header encontrado');
      return null;
    }

    functions.logger.info(`✓ ${headers.length} headers encontrados`);

    // Extrai linhas do <tbody>
    const tbody = table.find('tbody');
    if (tbody.length === 0) {
      functions.logger.warn('⚠ Nenhum <tbody> encontrado');
      return null;
    }

    const rows = tbody.find('tr');
    functions.logger.info(`✓ ${rows.length} linhas encontradas`);

    // Processa cada linha
    const dados: TreasuryAssetEntry[] = [];
    rows.each((rowIdx, tr) => {
      const cells = $(tr).find('td');

      if (cells.length === 0) {
        return; // Skip
      }

      const rowData: any = {};
      cells.each((colIdx, td) => {
        // Tenta usar data-column-index se disponível
        let index = colIdx;
        const dataColIdx = $(td).attr('data-column-index');
        if (dataColIdx) {
          index = parseInt(dataColIdx, 10);
        }

        // Garante que não estoura bounds
        if (index < headers.length) {
          const header = headers[index];
          const value = $(td).text().trim();

          // Só adiciona se não vazio
          if (value) {
            rowData[header] = value;
          }
        }
      });

      // Só adiciona linha se tem dados
      if (Object.keys(rowData).length > 0) {
        dados.push(rowData);
      }
    });

    functions.logger.info(`✓ ${dados.length} linhas processadas`);
    return dados;
  } catch (error) {
    functions.logger.error('❌ Erro ao extrair tabela:', error);
    return null;
  }
}

/**
 * Valida se os dados têm a estrutura esperada
 */
function validateTableData(data: TreasuryAssetEntry[]): boolean {
  if (!Array.isArray(data) || data.length === 0) {
    functions.logger.warn('⚠ Dados vazios ou não é array');
    return false;
  }

  // Verifica se primeira linha tem campos esperados
  const firstRow = data[0];
  const expectedFields = ['Título', 'Vencimento', 'Código ISIN'];

  const hasExpectedFields = expectedFields.every(
    (field) => field in firstRow && firstRow[field as keyof TreasuryAssetEntry]
  );

  if (!hasExpectedFields) {
    functions.logger.warn('⚠ Estrutura de dados inesperada.');
    functions.logger.warn(`  Campos encontrados: ${Object.keys(firstRow).join(', ')}`);
    return false;
  }

  functions.logger.info('✓ Dados validados com sucesso');
  return true;
}

/**
 * Salva dados no Firestore collection 'precos-tesouro'
 * ID = YYYY-MM-DD
 */
async function saveTreasuryToFirestore(data: TreasuryAssetEntry[]): Promise<boolean> {
  try {
    // Gerar ID com a data em formato YYYY-MM-DD (ISO 8601)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const docId = `${year}-${month}-${day}`;

    // Salvar no Firestore
    await db.collection('precos-tesouro').doc(docId).set(
      {
        snapshot: data,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: false } // Sobrescrever se já existe (mesma data)
    );

    functions.logger.info(`Dados salvos no Firestore (docId: ${docId}, ${data.length} entradas)`);
    return true;
  } catch (error) {
    functions.logger.error('Erro ao salvar no Firestore:', error);
    return false;
  }
}

/**
 * HTTP Cloud Function para sincronizar dados de tesouro
 * Pode ser chamada manualmente via HTTP POST
 */
export const syncTreasuryData = functions.https.onRequest(async (req, res) => {
  // Apenas POST permitido
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed. Use POST.');
    return;
  }

  try {
    functions.logger.info('Iniciando sincronização de dados de Tesouro Direto');

    // Passo 1: Scraping
    const htmlContent = await scrapeTreasuryPage();
    if (!htmlContent) {
      throw new Error('Falha ao fazer scraping');
    }

    // Passo 2: Parsing
    const data = await extractTableFromHtml(htmlContent);
    if (!data) {
      throw new Error('Tabela não encontrada no HTML');
    }

    // Passo 3: Validação
    if (!validateTableData(data)) {
      throw new Error('Dados inválidos');
    }

    // Passo 4: Salvar no Firestore
    const saved = await saveTreasuryToFirestore(data);
    if (!saved) {
      throw new Error('Erro ao salvar no Firestore');
    }

    functions.logger.info('Sincronização concluída com sucesso');
    res.status(200).json({
      success: true,
      message: 'Dados de tesouro sincronizados com sucesso',
      recordCount: data.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    functions.logger.error('⚠ Erro na sincronização:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * NOTA: Para Cloud Scheduler automático, configure manualmente:
 * 1. Google Cloud Console → Cloud Scheduler
 * 2. Criar novo job com URL: https://us-central1-{project-id}.cloudfunctions.net/syncTreasuryData
 * 3. Schedule: "0 18 * * 1-5" (18h, seg-sex)
 * 4. Method: POST
 * 5. Timezone: America/Sao_Paulo
 */
