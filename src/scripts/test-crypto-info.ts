// src/scripts/test-crypto-info.ts

async function testCrypto() {
  const BRAPITOKEN = 'qEWkBzyhwUsDsseMXJ9Jhz';
  
  console.log('--- Buscando Tickers Disponíveis ---');
  const availableUrl = `https://brapi.dev/api/v2/crypto/available?token=${BRAPITOKEN}`;
  
  try {
    const resAvail = await fetch(availableUrl);
    const dataAvail = await resAvail.json();
    console.log('Exemplo de tickers:', dataAvail.coins.slice(0, 5));

    // Vamos testar a busca de múltiplos ativos como você sugeriu
    const coins = 'BTC,ETH'; 
    const currency = 'BRL'; // ou USD conforme sua preferência
    const infoUrl = `https://brapi.dev/api/v2/crypto?coin=${coins}&currency=${currency}&token=${BRAPITOKEN}`;

    console.log(`\n--- Buscando Dados de: ${coins} ---`);
    const resInfo = await fetch(infoUrl);
    const dataInfo = await resInfo.json();

    // Isso nos mostrará a estrutura exata de 'coins' dentro de 'results'
    console.log('Estrutura do primeiro resultado:', JSON.stringify(dataInfo.coins[0], null, 2));

  } catch (error) {
    console.error('Erro no teste:', error);
  }
}

testCrypto();
