import { getStockInfo } from "@/services/brapi";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import AnaliseAtivoClient from "./analise-ativo-client";

type Props = {
  params: { ticker: string };
};

// Gera os metadados (título e descrição para SEO) dinamicamente
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const ticker = params.ticker.toUpperCase();
  const stockInfo = await getStockInfo(ticker).catch(() => null);

  if (!stockInfo) {
    return {
      title: "Ativo não encontrado",
      description: "A análise para este ativo não está disponível.",
    };
  }

  return {
    title: `${ticker}: como diferentes perfis analisam esta ação | SafeStart Invest`,
    description: `Entenda como a ${ticker} é analisada por diferentes perfis de investidor no SafeStart Invest. Veja dados, contexto, riscos e leitura por personas.`,
  };
}

// A página em si, que busca os dados e os passa para o componente cliente
export default async function AcoesPage({ params }: Props) {
  const ticker = params.ticker.toUpperCase();
  const stockInfo = await getStockInfo(ticker).catch(() => null);

  if (!stockInfo) {
    notFound();
  }

  // Aqui poderíamos buscar mais dados, como notícias, dados macro, etc.
  // e passar para o componente cliente.

  return <AnaliseAtivoClient stockInfo={stockInfo} />;
}
