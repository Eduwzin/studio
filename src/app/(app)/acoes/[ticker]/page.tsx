import { getStockInfo } from "@/services/brapi";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import AnaliseAtivoClient from "./analise-ativo-client";
import { analyzeAssetForPageAction } from "@/lib/actions";
import { placeholderImages } from "@/lib/content";

type Props = {
  params: { ticker: string };
};

// Gera os metadados (título, descrição, OG, etc.) dinamicamente
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
  
  const pageTitle = `${ticker} vale a pena? Como diferentes perfis analisam a ação | SafeStart Invest`;
  const pageDescription = `Entenda como a ${ticker} é analisada por diferentes perfis de investidor. Veja dados, riscos, dividendos, contexto e leitura por personas no SafeStart Invest.`;
  const ogImage = placeholderImages.find(p => p.id === 'blog-market-trends')?.imageUrl || '/default-og-image.png';

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
        title: pageTitle,
        description: pageDescription,
        type: 'article',
        url: `https://safestart-invest.com/acoes/${ticker}`, // Replace with actual domain later
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: `Análise do ativo ${ticker}`,
            },
        ],
    }
  };
}

// A página em si, que busca os dados e os passa para o componente cliente
export default async function AcoesPage({ params }: Props) {
  const ticker = params.ticker.toUpperCase();
  
  // Busca os dados do ativo e a análise da IA em paralelo
  const [stockInfo, aiAnalysis] = await Promise.all([
    getStockInfo(ticker).catch(() => null),
    analyzeAssetForPageAction(ticker).catch((e) => {
      console.error(`AI analysis failed for ${ticker}:`, e);
      return null;
    })
  ]);

  if (!stockInfo) {
    notFound();
  }

  // Estrutura de dados para o Schema JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://safestart-invest.com/acoes/${ticker}`, // Replace with actual domain
    },
    headline: `${ticker} vale a pena? Veja como diferentes perfis analisam a ação`,
    description: `Entenda como a ${ticker} é analisada por diferentes perfis de investidor. Veja dados, riscos, dividendos, contexto e leitura por personas no SafeStart Invest.`,
    author: {
        '@type': 'Organization',
        name: 'SafeStart Invest',
    },
    publisher: {
        '@type': 'Organization',
        name: 'SafeStart Invest',
        logo: {
            '@type': 'ImageObject',
            url: 'https://safestart-invest.com/logo.png', // Replace with actual logo URL
        },
    },
    datePublished: new Date().toISOString(), // Pode ser a data da última análise
    image: placeholderImages.find(p => p.id === 'blog-market-trends')?.imageUrl,
    ...(aiAnalysis?.faq && {
        mainEntity: {
            '@type': 'FAQPage',
            mainEntity: aiAnalysis.faq.map(item => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: item.answer,
                },
            })),
        },
    }),
  };

  return (
    <>
        {/* Adiciona o script JSON-LD ao head do documento */}
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Passa tanto os dados brutos quanto a análise da IA para o componente cliente */}
        <AnaliseAtivoClient stockInfo={stockInfo} aiAnalysis={aiAnalysis} />
    </>
    );
}
