

import { getSelicRate, getIpcaRate, getProjectedSelicRate, getProjectedIpcaRate, getStockInfo, StockInfo } from '@/services/brapi';
import MonitoramentoClient from './monitoramento-client';

export default async function MonitoramentoPage() {
    let selicRate: number;
    let ipcaRate: number;
    let projectedSelicRate: number;
    let projectedIpcaRate: number;
    let ifixData: StockInfo | null = null;

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
        ifixData = await getStockInfo('IFIX.SA');
    } catch (error) {
        console.error("Usando variação do IFIX de fallback devido a erro na API:", error);
        // Em caso de erro, ifixData permanecerá nulo.
    }


    // Determina a tendência da SELIC
    let selicTrend: 'alta' | 'queda' | 'estavel';
    if (projectedSelicRate < selicRate) {
        selicTrend = 'queda';
    } else if (projectedSelicRate > selicRate) {
        selicTrend = 'alta';
    } else {
        selicTrend = 'estavel';
    }

    // Determina a tendência do IPCA
    let ipcaTrend: 'alta' | 'queda' | 'estavel';
    if (projectedIpcaRate < ipcaRate) {
        ipcaTrend = 'queda';
    } else if (projectedIpcaRate > ipcaRate) {
        ipcaTrend = 'alta';
    } else {
        ipcaTrend = 'estavel';
    }

    return <MonitoramentoClient 
        selicRate={selicRate} 
        ipcaRate={ipcaRate} 
        projectedSelicRate={projectedSelicRate}
        selicTrend={selicTrend}
        projectedIpcaRate={projectedIpcaRate}
        ipcaTrend={ipcaTrend}
        ifixData={ifixData}
    />;
}
