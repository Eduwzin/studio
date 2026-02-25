/**
 * @fileOverview Listas de tickers de ações, FIIs e ETFs para consulta.
 * Estas listas são usadas para "aterrar" as sugestões da IA, fornecendo um universo
 * de ativos líquidos e conhecidos para ela escolher.
 */

// Ações (Blue Chips e empresas conhecidas de diversos setores)
export const STOCK_TICKERS = [
  // Bancos
  "ITUB4", "BBDC4", "BBAS3", "SANB11",
  // Commodities
  "PETR4", "VALE3", "SUZB3",
  // Varejo
  "MGLU3", "VVAR3", "LREN3",
  // Elétricas
  "ELET3", "CMIG4",
  // Outros
  "ABEV3", "B3SA3", "WEGE3", "RAIL3"
];

// FIIs (Fundos de diferentes segmentos: lajes, logística, papel, shopping)
export const FII_TICKERS = [
  "MXRF11", // Papel
  "HGLG11", // Logística
  "KNCR11", // Papel
  "BCFF11", // Fundo de Fundos
  "XPML11", // Shoppings
  "XPLG11", // Logística
  "IRDM11", // Papel
  "VISC11"  // Shoppings
];

// ETFs (Índices diversificados do Brasil e do exterior)
export const ETF_TICKERS = [
  "BOVA11", // Ibovespa
  "SMAL11", // Small Caps
  "IVVB11", // S&P 500
  "XINA11", // Ações da China
  "GOLD11"  // Ouro
];
