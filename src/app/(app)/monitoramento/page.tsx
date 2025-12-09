
import { getSelicRate, getIpcaRate, getProjectedSelicRate, getProjectedIpcaRate, getStockInfo, StockInfo, getDollarRate, DollarInfo } from '@/services/brapi';
import MonitoramentoClient from './monitoramento-client';

export default async function MonitoramentoPage() {
    // Os dados agora são buscados na Server Action 'monitorPortfolio'
    // Esta página do servidor apenas renderiza o componente cliente.
    // A lógica de busca e cálculo foi movida para 'src/lib/actions.ts'
    // para ser reutilizável e centralizada.

    // A busca inicial de dados para exibição ainda pode ser feita aqui
    // para evitar um carregamento vazio no cliente.
    const selicRate = await getSelicRate().catch(() => 10.50);
    const ipcaRate = await getIpcaRate().catch(() => 3.9);
    const projectedSelicRate = await getProjectedSelicRate().catch(() => 9.75);
    const projectedIpcaRate = await getProjectedIpcaRate().catch(() => 3.8);
    const ifixData = await getStockInfo('IFIX').catch(() => null);
    const ibovData = await getStockInfo('^BVSP', '1y', '1wk').catch(() => null);
    const dollarInfo = await getDollarRate().catch(() => ({ currentRate: 5.25, history: [] }));


    let selicTrend: 'alta' | 'queda' | 'estavel';
    if (projectedSelicRate < selicRate) selicTrend = 'queda';
    else if (projectedSelicRate > selicRate) selicTrend = 'alta';
    else selicTrend = 'estavel';

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
        projectedSelicRate={projectedSelicRate}
        selicTrend={selicTrend}
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
