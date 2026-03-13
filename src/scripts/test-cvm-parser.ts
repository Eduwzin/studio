import { processCvmFiiFile } from '../lib/cvm-parser';

async function runTest() {
  console.log('Iniciando o teste de leitura do arquivo CVM...');

  // O caminho para o arquivo CSV, relativo à raiz do projeto.
  const filePath = 'src/data/cvm-reports/inf_mensal_fii_geral_2026.csv';

  try {
    const jsonData = await processCvmFiiFile(filePath);

    if (jsonData.length > 0) {
      console.log('Conversão e padronização bem-sucedidas!');
      console.log('Amostra dos 10 primeiros registros:');
      // Usamos console.dir para uma melhor visualização de objetos complexos
      console.dir(jsonData.slice(0, 10), { depth: null });
    } else {
      console.log('O arquivo foi lido, mas nenhum registro foi retornado.');
    }
  } catch (error) {
    console.error('O teste falhou:', error);
  }
}

// Executa a função de teste
runTest();
