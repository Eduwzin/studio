
import { getSelicRate, getIpcaRate, getProjectedSelicRate } from '@/services/brapi';
import MonitoramentoClient from './monitoramento-client';

export default async function MonitoramentoPage() {
    let selicRate: number;
    let ipcaRate: number;
    let projectedSelicRate: number;

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

    // Determina a tendência da SELIC
    let selicTrend: 'alta' | 'queda' | 'estavel';
    if (projectedSelicRate < selicRate) {
        selicTrend = 'queda';
    } else if (projectedSelicRate > selicRate) {
        selicTrend = 'alta';
    } else {
        selicTrend = 'estavel';
    }

    return <MonitoramentoClient 
        selicRate={selicRate} 
        ipcaRate={ipcaRate} 
        projectedSelicRate={projectedSelicRate}
        selicTrend={selicTrend}
    />;
}
