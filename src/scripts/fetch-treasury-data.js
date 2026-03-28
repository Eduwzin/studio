/**
 * Módulo para scraping e parsing de dados de Tesouro Direto da ANBIMA
 * 
 * Features:
 * - Scraping com Playwright
 * - Parsing robusto com cheerio (não depende de classes CSS)
 * - Validação antes de salvar
 * - Safety: não sobrescreve dados se tabela não encontrada
 */

import { chromium } from 'playwright';
import * as cheerio from 'cheerio';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TREASURY_DIR = path.join(__dirname, '..', 'data', 'tesouro-direto');
const ANBIMA_URL = 'https://data.anbima.com.br/titulos-publicos/monitoramento-intradiario-de-titulos-publicos-federais';

/**
 * Faz scraping da página ANBIMA e retorna HTML
 * @returns {Promise<string>} HTML da página, ou null se falhar
 */
async function scrapeTreasuryPage() {
  let browser;
  try {
    console.log('📡 Iniciando Playwright para scraping...');
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    console.log(`🌐 Acessando ${ANBIMA_URL}...`);
    await page.goto(ANBIMA_URL, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Aguarda pela tabela render
    await page.waitForSelector('table', { timeout: 10000 });
    
    const content = await page.content();
    console.log('✓ HTML coletado com sucesso');
    
    return content;
  } catch (error) {
    console.error('❌ Erro ao fazer scraping:', error.message);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Extrai tabela HTML e converte para JSON
 * Estratégia robusta: não depende de classes CSS
 * 
 * @param {string} htmlContent - HTML da página
 * @returns {Promise<Array<Object>>} Array com dados da tabela, ou null se não encontrada
 */
async function extractTableFromHtml(htmlContent) {
  try {
    const $ = cheerio.load(htmlContent);
    
    // Busca pela tabela (sem depender de classes)
    const table = $('table').first();
    if (table.length === 0) {
      console.warn('⚠ Nenhuma tabela encontrada no HTML');
      return null;
    }
    
    // Extrai headers do <thead>
    const thead = table.find('thead');
    if (thead.length === 0) {
      console.warn('⚠ Nenhum <thead> encontrado na tabela');
      return null;
    }
    
    const headerRow = thead.find('tr').first();
    if (headerRow.length === 0) {
      console.warn('⚠ Nenhuma linha de header em <thead>');
      return null;
    }
    
    // Extrai texto dos headers em ordem
    const headers = [];
    headerRow.find('th').each((_, el) => {
      const text = $(el).text().trim();
      headers.push(text);
    });
    
    if (headers.length === 0) {
      console.warn('⚠ Nenhum header encontrado');
      return null;
    }
    
    console.log(`✓ ${headers.length} headers encontrados`);
    
    // Extrai linhas do <tbody>
    const tbody = table.find('tbody');
    if (tbody.length === 0) {
      console.warn('⚠ Nenhum <tbody> encontrado');
      return null;
    }
    
    const rows = tbody.find('tr');
    console.log(`✓ ${rows.length} linhas encontradas`);
    
    // Processa cada linha
    const dados = [];
    rows.each((rowIdx, tr) => {
      const cells = $(tr).find('td');
      
      if (cells.length === 0) {
        return; // Skip
      }
      
      const rowData = {};
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
    
    console.log(`✓ ${dados.length} linhas processadas`);
    return dados;
  } catch (error) {
    console.error('❌ Erro ao extrair tabela:', error.message);
    return null;
  }
}

/**
 * Valida se os dados têm a estrutura esperada
 * @param {Array<Object>} data - Dados a validar
 * @returns {boolean} True se válido
 */
function validateTableData(data) {
  if (!Array.isArray(data) || data.length === 0) {
    console.warn('⚠ Dados vazios ou não é array');
    return false;
  }
  
  // Verifica se primeira linha tem campos esperados
  const firstRow = data[0];
  const expectedFields = ['Título', 'Vencimento', 'Código ISIN'];
  
  const hasExpectedFields = expectedFields.every(field => 
    field in firstRow && firstRow[field]
  );
  
  if (!hasExpectedFields) {
    console.warn('⚠ Estrutura de dados inesperada. Campos esperados:', expectedFields);
    console.warn('  Campos encontrados:', Object.keys(firstRow));
    return false;
  }
  
  console.log('✓ Dados validados com sucesso');
  return true;
}

/**
 * Obtém o caminho do último arquivo JSON de tesouro
 * @returns {Promise<string|null>} Caminho do arquivo ou null se não existir
 */
async function getLatestTreasuryFile() {
  try {
    const files = await fs.readdir(TREASURY_DIR);
    const jsonFiles = files
      .filter(f => f.endsWith('.json') && f.startsWith('titulos_publicos_'))
      .sort()
      .reverse();
    
    if (jsonFiles.length > 0) {
      return path.join(TREASURY_DIR, jsonFiles[0]);
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Salva dados em arquivo JSON com timestamp
 * @param {Array<Object>} data - Dados a salvar
 * @returns {Promise<string>} Caminho do arquivo salvo, ou null se falha
 */
async function saveJsonFile(data) {
  try {
    // Cria diretório se não existir
    await fs.mkdir(TREASURY_DIR, { recursive: true });
    
    // Gera filename com timestamp
    const now = new Date();
    const date = now.toISOString().split('T')[0].replace(/-/g, '');
    const time = String(now.getHours()).padStart(2, '0') +
                 String(now.getMinutes()).padStart(2, '0') +
                 String(now.getSeconds()).padStart(2, '0');
    const filename = `titulos_publicos_${date}_${time}.json`;
    const filepath = path.join(TREASURY_DIR, filename);
    
    // Salva JSON
    await fs.writeFile(
      filepath,
      JSON.stringify(data, null, 2),
      'utf-8'
    );
    
    console.log(`✓ JSON salvo: ${filename}`);
    return filepath;
  } catch (error) {
    console.error('❌ Erro ao salvar JSON:', error.message);
    return null;
  }
}

/**
 * Função principal: orquestra todo o fluxo
 * @param {Object} options - Opções
 * @param {boolean} options.saveSilent - Se true, não exibe detalhes
 * @returns {Promise<Object>} Resultado { success, filepath, error }
 */
export async function fetchTreasuryData(options = {}) {
  const { saveSilent = false } = options;
  
  console.log('\n' + '='.repeat(60));
  console.log('🏦 Iniciando atualização de dados de Tesouro Direto');
  console.log('='.repeat(60) + '\n');
  
  try {
    // Passo 1: Scraping
    const htmlContent = await scrapeTreasuryPage();
    if (!htmlContent) {
      throw new Error('Falha ao fazer scraping - mantendo dados anteriores');
    }
    
    // Passo 2: Parsing
    const data = await extractTableFromHtml(htmlContent);
    if (!data) {
      throw new Error('Tabela não encontrada no HTML - mantendo dados anteriores');
    }
    
    // Passo 3: Validação
    if (!validateTableData(data)) {
      throw new Error('Dados inválidos - mantendo dados anteriores');
    }
    
    // Passo 4: Salvar
    const filepath = await saveJsonFile(data);
    if (!filepath) {
      throw new Error('Erro ao salvar arquivo - mantendo dados anteriores');
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Sucesso! Dados atualizados');
    console.log(`📊 Total de registros: ${data.length}`);
    console.log('='.repeat(60) + '\n');
    
    return {
      success: true,
      filepath,
      recordCount: data.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('\n' + '='.repeat(60));
    console.error('⚠ Erro no processamento:', error.message);
    
    // Tenta encontrar arquivo anterior para mencionar
    const lastFile = await getLatestTreasuryFile();
    if (lastFile) {
      console.error(`📁 Mantendo dados anteriores: ${path.basename(lastFile)}`);
    }
    
    console.error('='.repeat(60) + '\n');
    
    return {
      success: false,
      error: error.message,
      lastFileKept: await getLatestTreasuryFile(),
      timestamp: new Date().toISOString()
    };
  }
}

// Permitir execução direta do módulo
if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await fetchTreasuryData();
  process.exit(result.success ? 0 : 1);
}
