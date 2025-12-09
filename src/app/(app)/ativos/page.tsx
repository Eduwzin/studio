import AtivosClient from "@/app/(app)/ativos/ativos-client";
import { getAvailableTickers } from "@/services/brapi";

export default async function AtivosPage() {
    
    // Busca os dados no servidor, onde a API token está disponível
    const { stocks, fiis, bdrs } = await getAvailableTickers();

    // Passa os dados para o componente cliente que lida com a interatividade (abas, filtro)
    return <AtivosClient initialData={{ stocks, fiis, bdrs }} />;
}
