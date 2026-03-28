#!/usr/bin/env node

/**
 * CLI para atualizar dados de Tesouro Direto
 * Uso: node src/scripts/fetch-treasury-cli.js
 * Ou via npm: npm run fetch-treasury
 */

import { fetchTreasuryData } from './fetch-treasury-data.js';

async function main() {
  const result = await fetchTreasuryData();
  
  if (!result.success) {
    process.exit(1);
  }
  
  process.exit(0);
}

main().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
