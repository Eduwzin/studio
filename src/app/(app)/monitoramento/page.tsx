
import { getSelicRate, getIpcaRate } from '@/services/brapi';
import MonitoramentoClient from './monitoramento-client';

export default async function MonitoramentoPage() {
    let selicRate: number;
    let ipcaRate: number;

    try {
        // Busca a taxa SELIC real no servidor
        selicRate = await getSelicRate();
    } catch (error) {
        // Em caso de erro na API, usa um valor padrão para não quebrar a página
        console.error("Usando taxa SELIC de fallback devido a erro na API:", error);
        selicRate = 10.50; 
    }

    try {
        // Busca a taxa IPCA real no servidor
        ipcaRate = await getIpcaRate();
    } catch (error) {
        // Em caso de erro na API, usa um valor padrão
        console.error("Usando taxa IPCA de fallback devido a erro na API:", error);
        ipcaRate = 3.9;
    }

    return <MonitoramentoClient selicRate={selicRate} ipcaRate={ipcaRate} />;
}
