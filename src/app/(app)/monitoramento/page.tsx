
import { getSelicRate } from '@/services/brapi';
import MonitoramentoClient from './monitoramento-client';

export default async function MonitoramentoPage() {
    let selicRate: number;
    try {
        // Busca a taxa SELIC real no servidor
        selicRate = await getSelicRate();
    } catch (error) {
        // Em caso de erro na API, usa um valor padrão para não quebrar a página
        console.error("Usando taxa SELIC de fallback devido a erro na API:", error);
        selicRate = 10.50; 
    }

    return <MonitoramentoClient selicRate={selicRate} />;
}
