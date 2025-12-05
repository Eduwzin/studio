
import { getSelicRate, getIpcaRate, getProjectedSelicRate, getProjectedIpcaRate, getStockInfo, StockInfo, getDollarRate } from '@/services/brapi';
import MonitoramentoClient from './monitoramento-client';

export default async function MonitoramentoPage() {
    let selicRate: number;
    let ipcaRate: number;
    let projectedSelicRate: number;
    let projectedIpcaRate: number;
    let ifixData: StockInfo | null = null;
    let ibovData: StockInfo | null = null;
    let dollarRate: number;

    // --- Data Fetching ---
    try {
        selicRate = await getSelicRate();
    } catch (error) {
        console.error("Usando taxa SELIC de fallback devido a erro na API:", error);
        selicRate = 10.50; 
    }

    try {
        ipcaRate = await getIpcaRate();
    } catch (error) {
        console.error("Usando taxa IPCA de fallback devido a erro na API:", error);
        ipcaRate = 3.9;
    }

    try {
        projectedSelicRate = await getProjectedSelicRate();
    } catch (error) {
        console.error("Usando projeção da SELIC de fallback devido a erro na API:", error);
        projectedSelicRate = 9.75;
    }

    try {
        projectedIpcaRate = await getProjectedIpcaRate();
    } catch (error) {
        console.error("Usando projeção do IPCA de fallback devido a erro na API:", error);
        projectedIpcaRate = 3.8;
    }

    try {
        ifixData = await getStockInfo('IFIX');
    } catch (error) {
        console.error("Usando variação do IFIX de fallback devido a erro na API:", error);
    }
    
    try {
        ibovData = await getStockInfo('^BVSP', '1y', '1wk');
    } catch (error) {
        console.error("Usando dados do IBOV de fallback devido a erro na API:", error);
    }
    
    try {
        dollarRate = await getDollarRate();
    } catch (error) {
        console.error("Usando cotação do Dólar de fallback devido a erro na API:", error);
        dollarRate = 5.25;
    }

    // --- Trend Calculation ---

    // SELIC & IPCA Trends
    let selicTrend: 'alta' | 'queda' | 'estavel';
    if (projectedSelicRate < selicRate) selicTrend = 'queda';
    else if (projectedSelicRate > selicRate) selicTrend = 'alta';
    else selicTrend = 'estavel';

    let ipcaTrend: 'alta' | 'queda' | 'estavel';
    if (projectedIpcaRate < ipcaRate) ipcaTrend = 'queda';
    else if (projectedIpcaRate > ipcaRate) ipcaTrend = 'alta';
    else ipcaTrend = 'estavel';

    // IBOV Trend Calculations
    let ibovChange1d = ibovData?.regularMarketChangePercent ?? 0;
    let ibovChange30d = 0;
    let ibovChange365d = 0;

    if (ibovData?.historicalDataPrice && ibovData.historicalDataPrice.length > 0) {
        const historicalData = ibovData.historicalDataPrice.sort((a, b) => b.date - a.date);
        const latestClose = historicalData[0]?.close;
        
        if (latestClose) {
            // 30-day trend (approx 4 weeks)
            const close30d = historicalData[4]?.close;
            if (close30d) {
                ibovChange30d = ((latestClose - close30d) / close30d) * 100;
            }

            // 365-day trend (approx 52 weeks)
            const close365d = historicalData[historicalData.length - 1]?.close;
            if (close365d) {
                ibovChange365d = ((latestClose - close365d) / close365d) * 100;
            }
        }
    }

    return <MonitoramentoClient 
        selicRate={selicRate} 
        ipcaRate={ipcaRate} 
        projectedSelicRate={projectedSelicRate}
        selicTrend={selicTrend}
        projectedIpcaRate={projectedIpcaRate}
        ipcaTrend={ipcaTrend}
        ifixData={ifixData}
        ibovData={ibovData}
        dollarRate={dollarRate}
        ibovChange1d={ibovChange1d}
        ibovChange30d={ibovChange30d}
        ibovChange365d={ibovChange365d}
    />;
}
