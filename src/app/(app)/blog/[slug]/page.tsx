
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { notFound } from "next/navigation";
import { placeholderImages } from "@/lib/content";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { getSelicRate, getIpcaRate } from "@/services/brapi"; 
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Metadata, ResolvingMetadata } from "next";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import type { Article, ArticleContent, HtmlContentBlock, SimulationTableBlock } from "@/lib/content";
import SimulationTable from "@/components/blog/SimulationTable";
import { initializeApp, getApps, getApp } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';

type Props = {
  params: { slug: string };
};

// Helper para inicializar o DB no servidor
function getDb() {
  if (getApps().length) {
    return getFirestore(getApp());
  }
  const app = initializeApp(firebaseConfig);
  return getFirestore(app);
}

// Função para buscar o artigo
async function getArticle(slug: string): Promise<Article | null> {
  const db = getDb();
  const docRef = doc(db, 'articles', slug);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  
  const articleData: Article = {
    ...data,
    slug: docSnap.id,
    date: data.lastUpdated.toDate().toISOString(),
    lastUpdated: data.lastUpdated.toDate().toISOString(),
  } as Article;

  return articleData;
}


export async function generateStaticParams() {
  const db = getDb();
  const articlesCol = collection(db, 'articles');
  const articlesSnapshot = await getDocs(articlesCol);
  const articles = articlesSnapshot.docs.map(doc => ({ slug: doc.id }));
  return articles;
}


// Gera os metadados dinamicamente
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const article = await getArticle(params.slug);

  if (!article) {
    return {
      title: "Artigo não encontrado",
    };
  }

  const title = article.seoTitle || article.title;
  const excerpt = article.description;
  const seoDescription = article.seoDescription || article.description;
  const image = placeholderImages.find(p => p.id === `blog-${article.slug}`);
  const canonicalUrl = `https://safestart-invest.com/blog/${article.slug}`;

  return {
    title,
    description: seoDescription,
    alternates: {
        canonical: canonicalUrl,
    },
    openGraph: {
        title,
        description: excerpt,
        type: 'article',
        publishedTime: new Date(article.date).toISOString(),
        url: canonicalUrl,
        images: image ? [{
            url: image.imageUrl,
            width: 1200,
            height: 630,
            alt: title,
        }] : [],
    },
  };
}


// Componente da Seção de FAQ
function FaqSection({ faq, dynamicReplacers }: { faq: { question: string; answer: string }[], dynamicReplacers: (text: string) => string }) {
  if (!faq || faq.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-3xl font-bold font-headline mb-6">Perguntas Frequentes</h2>
      <Accordion type="single" collapsible className="w-full">
        {faq.map((item, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger className="text-left font-semibold">{dynamicReplacers(item.question)}</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">{dynamicReplacers(item.answer)}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

// Componente para o Disclaimer
function DisclaimerSection({ text }: { text?: string }) {
  if (!text) return null;

  return (
    <Alert className="mt-12 bg-muted/50">
      <Info className="h-4 w-4" />
      <AlertTitle>Aviso Legal</AlertTitle>
      <AlertDescription>
        {text}
      </AlertDescription>
    </Alert>
  );
}

const RenderContentBlock = ({ block, cdiRate, selicRate, replacePlaceholders }: { block: ArticleContent[0], cdiRate: number, selicRate: number, replacePlaceholders: (text: string) => string }) => {
    switch (block.type) {
        case 'html':
            const htmlBlock = block as HtmlContentBlock;
            return (
                <div
                    className="prose prose-lg max-w-none prose-h3:font-headline prose-h3:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground"
                    dangerouslySetInnerHTML={{ __html: replacePlaceholders(htmlBlock.content) }}
                />
            );
        case 'simulationTable':
            const tableBlock = block as any; // Usar 'any' para lidar com 'rateLogic'
            
            const processedScenarios = tableBlock.scenarios.map((scenario: any) => {
                 let annualRate = 0;
                 try {
                    // Avalia a string de lógica de forma segura
                    annualRate = new Function('cdi', 'selic', `return ${scenario.rateLogic}`)(cdiRate, selicRate);
                 } catch(e) {
                    console.error("Erro ao avaliar rateLogic:", scenario.rateLogic, e);
                 }
                return {
                    label: scenario.label,
                    isTaxable: scenario.isTaxable,
                    annualRate: annualRate
                };
            });
            
            return <SimulationTable 
                selicRate={selicRate}
                initialInvestment={tableBlock.initialInvestment}
                monthlyInvestment={tableBlock.monthlyInvestment}
                scenarios={processedScenarios}
                terms={tableBlock.terms}
                showDifference={tableBlock.showDifference}
            />;
        default:
            return null;
    }
};


// Make the component async to fetch data
export default async function BlogPostPage({ params }: Props) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }
  
  const image = placeholderImages.find(p => p.id === `blog-${article.slug}`);

  // --- Fetch real-time data ---
  const [selicRate, ipcaRate] = await Promise.all([
    getSelicRate().catch(() => 10.50), // Default value on error
    getIpcaRate().catch(() => 3.90)   // Default value on error
  ]);

  // --- Calculate all dynamic variables ---
  const cdiRate = selicRate - 0.10;
  const cdbExampleRate = cdiRate * 1.10; // Mantido para compatibilidade
  const cdb90Rate = cdiRate * 0.90;
  const cdb95Rate = cdiRate * 0.95;
  const cdb100Rate = cdiRate;
  const cdb120Rate = cdiRate * 1.20;
  const lci90Rate = cdiRate * 0.90;
  const lci95Rate = cdiRate * 0.95;
  const poupancaRate = selicRate > 8.5 ? 6.17 : selicRate * 0.70;
  const dataAtualizacao = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  
  // --- Function to replace placeholders in any text ---
  const replacePlaceholders = (text: string): string => {
    if (!text) return '';
    return text
      .replace(/{{selicRate}}/g, selicRate.toFixed(2))
      .replace(/{{cdiRate}}/g, cdiRate.toFixed(2))
      .replace(/{{cdbExampleRate}}/g, cdbExampleRate.toFixed(2))
      .replace(/{{cdb100Rate}}/g, cdb100Rate.toFixed(2))
      .replace(/{{cdb90Rate}}/g, cdb90Rate.toFixed(2))
      .replace(/{{cdb95Rate}}/g, cdb95Rate.toFixed(2))
      .replace(/{{cdb120Rate}}/g, cdb120Rate.toFixed(2))
      .replace(/{{lci90Rate}}/g, lci90Rate.toFixed(2))
      .replace(/{{lci95Rate}}/g, lci95Rate.toFixed(2))
      .replace(/{{ipcaRate}}/g, ipcaRate.toFixed(2))
      .replace(/{{poupancaRate}}/g, poupancaRate.toFixed(2))
      .replace(/{{dataAtualizacao}}/g, dataAtualizacao);
  };
  
  // --- Replace placeholders in conclusion ---
  const dynamicConclusion = replacePlaceholders(article.conclusion);
  
  const baseUrl = 'https://safestart-invest.com';
  const canonicalUrl = `${baseUrl}/blog/${article.slug}`;

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/dashboard' },
    { label: 'Blog', href: '/blog' },
    { label: article.title, href: canonicalUrl },
  ];

  // JSON-LD Schema
  const jsonLdSchema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          "headline": article.seoTitle || article.title,
          "description": article.seoDescription || article.description,
          "image": image?.imageUrl,
          "datePublished": new Date(article.date).toISOString(),
          "dateModified": new Date(article.lastUpdated).toISOString(),
          "author": {
              "@type": "Organization",
              "name": "SafeStart Invest"
          },
          "publisher": {
            "@type": "Organization",
            "name": "SafeStart Invest",
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/logo.png`
            }
          },
          "inLanguage": "pt-BR"
        },
        ...(article.faq ? [{
            "@type": "FAQPage",
            "mainEntity": article.faq.map(item => ({
                "@type": "Question",
                "name": replacePlaceholders(item.question),
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": replacePlaceholders(item.answer),
                },
            })),
        }] : []),
        {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": `${baseUrl}/dashboard`
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Blog",
                    "item": `${baseUrl}/blog`
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": article.title,
                    "item": canonicalUrl
                }
            ]
        }
      ]
    };

  return (
    <>
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
    />
    <article className="max-w-3xl mx-auto">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />
        <header className="mb-8">
            <h1 className="text-4xl font-bold font-headline mb-2">{article.title}</h1>
            <Badge variant="outline">{new Date(article.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</Badge>
        </header>

        {image && (
            <div className="relative aspect-video rounded-lg overflow-hidden mb-8 shadow-md">
                <Image 
                    src={image.imageUrl} 
                    alt={image.description} 
                    fill
                    className="object-cover"
                    data-ai-hint={image.imageHint}
                    priority // Carregar a imagem principal com prioridade
                />
            </div>
        )}

        {article.content.map((block, index) => (
          <RenderContentBlock key={index} block={block} cdiRate={cdiRate} selicRate={selicRate} replacePlaceholders={replacePlaceholders} />
        ))}

        <FaqSection faq={article.faq || []} dynamicReplacers={replacePlaceholders} />
        
        {article.conclusion && (
          <div 
            className="prose prose-lg max-w-none prose-h3:font-headline prose-h3:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground mt-8"
            dangerouslySetInnerHTML={{ __html: dynamicConclusion }}
          />
        )}

        <DisclaimerSection text={article.disclaimer} />
    </article>
    </>
  );
}
