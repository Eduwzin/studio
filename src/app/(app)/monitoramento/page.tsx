
import { getSelicRate, getIpcaRate, getProjectedCurrentYearSelicRate, getProjectedNextYearSelicRate, getProjectedIpcaRate, getStockInfo, getDollarRate } from '@/services/brapi';
import MonitoramentoClient from './monitoramento-client';

export default async function MonitoramentoPage() {
    // Busca os dados no servidor para passar ao componente cliente.
    // A lógica de negócio e chamada à IA fica na Server Action 'monitorPortfolio',
    // que por sua vez também busca esses dados para garantir que estão sempre atualizados
    // no momento da análise.
    const selicRate = await getSelicRate().catch(() => 10.50);
    const ipcaRate = await getIpcaRate().catch(() => 3.9);
    const projectedCurrentYearSelic = await getProjectedCurrentYearSelicRate().catch(() => selicRate);
    const projectedNextYearSelic = await getProjectedNextYearSelicRate().catch(() => projectedCurrentYearSelic);
    const projectedIpcaRate = await getProjectedIpcaRate().catch(() => 3.8);
    const ifixData = await getStockInfo('IFIX').catch(() => null);
    const ibovData = await getStockInfo('IBOVESPA', '1y', '1wk').catch(() => null);
    const dollarInfo = await getDollarRate().catch(() => ({ currentRate: 5.25, history: [] }));

    let ipcaTrend: 'alta' | 'queda' | 'estavel';
    if (projectedIpcaRate < ipcaRate) ipcaTrend = 'queda';
    else if (projectedIpcaRate > ipcaRate) ipcaTrend = 'alta';
    else ipcaTrend = 'estavel';

    let ibovChange1d = ibovData?.regularMarketChangePercent ?? 0;
    let ibovChange30d = 0;
    let ibovChange365d = 0;

    if (ibovData?.historicalDataPrice && ibovData.historicalDataPrice.length > 0) {
        const historicalData = ibovData.historicalDataPrice.sort((a, b) => b.date - a.date);
        const latestClose = historicalData[0]?.close;
        
        if (latestClose) {
            const close30d = historicalData[4]?.close;
            if (close30d) {
                ibovChange30d = ((latestClose - close30d) / close30d) * 100;
            }

            const close365d = historicalData[historicalData.length - 1]?.close;
            if (close365d) {
                ibovChange365d = ((latestClose - close365d) / close365d) * 100;
            }
        }
    }


    return <MonitoramentoClient 
        selicRate={selicRate} 
        ipcaRate={ipcaRate} 
        projectedCurrentYearSelic={projectedCurrentYearSelic}
        projectedNextYearSelic={projectedNextYearSelic}
        projectedIpcaRate={projectedIpcaRate}
        ipcaTrend={ipcaTrend}
        ifixData={ifixData}
        ibovData={ibovData}
        dollarInfo={dollarInfo}
        ibovChange1d={ibovChange1d}
        ibovChange30d={ibovChange30d}
        ibovChange365d={ibovChange365d}
    />;
}
