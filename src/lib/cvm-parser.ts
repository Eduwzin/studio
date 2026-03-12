import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

// Interface para o dado normalizado
export interface NormalizedFiiData {
  cnpj: string;
  nomeFundo: string;
  dataReferencia: string;
  patrimonioLiquido: number;
  valorPatrimonialCota: number;
  cotasEmitidas: number;
  numeroCotistas: number;
  dividendYieldMes: number;
  rentabilidadeMes: number;
}

// Mapeamento dos cabeçalhos do CSV para as chaves do nosso objeto
const headerMapping: { [key: string]: keyof NormalizedFiiData } = {
  'CNPJ_Fundo_Classe': 'cnpj',
  'Nome_Fundo_Classe': 'nomeFundo',
  'Data_Referencia': 'dataReferencia',
  'Patrimonio_Liquido': 'patrimonioLiquido',
  'Valor_Patrimonial_Cotas': 'valorPatrimonialCota',
  'Cotas_Emitidas': 'cotasEmitidas',
  'Total_Numero_Cotistas': 'numeroCotistas',
  'Percentual_Dividend_Yield_Mes': 'dividendYieldMes',
  'Percentual_Rentabilidade_Efetiva_Mes': 'rentabilidadeMes', // Corrigido para o nome de campo mais comum
};

// Função para converter valores para número, tratando vírgula e formato
const toNumber = (value: string): number => {
  if (typeof value !== 'string' || value.trim() === '') return 0;
  // Remove pontos de milhar e substitui vírgula de decimal por ponto
  const cleanedValue = value.replace(/\./g, '').replace(',', '.');
  const num = parseFloat(cleanedValue);
  return isNaN(num) ? 0 : num;
};

/**
 * Normaliza um único registro do CSV para o formato desejado.
 * @param record O objeto lido do CSV pelo PapaParse.
 * @returns Um objeto com os campos padronizados e tipados.
 */
function normalizeRecord(record: any): NormalizedFiiData {
  const normalized: Partial<NormalizedFiiData> = {};

  for (const csvHeader in headerMapping) {
    const jsonKey = headerMapping[csvHeader];
    if (record[csvHeader] !== undefined) {
      // @ts-ignore
      normalized[jsonKey] = record[csvHeader];
    }
  }

  return {
    cnpj: String(normalized.cnpj || ''),
    nomeFundo: String(normalized.nomeFundo || ''),
    dataReferencia: String(normalized.dataReferencia || ''),
    patrimonioLiquido: toNumber(normalized.patrimonioLiquido as any),
    valorPatrimonialCota: toNumber(normalized.valorPatrimonialCota as any),
    cotasEmitidas: toNumber(normalized.cotasEmitidas as any),
    numeroCotistas: toNumber(normalized.numeroCotistas as any),
    dividendYieldMes: toNumber(normalized.dividendYieldMes as any),
    rentabilidadeMes: toNumber(normalized.rentabilidadeMes as any),
  };
}


/**
 * Lê um arquivo CSV de informes da CVM, faz o parse e normaliza os dados.
 * @param relativePath O caminho para o arquivo CSV, relativo à raiz do projeto.
 * @returns Uma Promise que resolve para um array de dados de FIIs normalizados.
 */
export async function processCvmFiiFile(relativePath: string): Promise<NormalizedFiiData[]> {
  return new Promise((resolve, reject) => {
    // Constrói o caminho absoluto para o arquivo
    const absolutePath = path.resolve(process.cwd(), relativePath);

    if (!fs.existsSync(absolutePath)) {
      return reject(new Error(`Arquivo não encontrado em: ${absolutePath}`));
    }
    
    const fileStream = fs.createReadStream(absolutePath, 'utf-8');

    const results: NormalizedFiiData[] = [];

    Papa.parse(fileStream, {
      header: true,
      skipEmptyLines: true,
      delimiter: ';', // CVM usa ponto-e-vírgula
      encoding: 'latin1', // Codificação comum em arquivos da CVM
      transformHeader: (header: string) => header.trim(),
      step: (result) => {
        // Renomeia os cabeçalhos para o nosso padrão e tipa os dados
        const normalized = normalizeRecord(result.data);
        results.push(normalized);
      },
      complete: () => {
        console.log(`Parsing do arquivo ${relativePath} completo. ${results.length} registros encontrados.`);
        resolve(results);
      },
      error: (error: Error) => {
        console.error('Erro durante o parsing do CSV:', error);
        reject(error);
      },
    });
  });
}
