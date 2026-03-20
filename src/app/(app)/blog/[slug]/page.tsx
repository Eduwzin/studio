import { notFound } from "next/navigation";
import { blogArticles, placeholderImages } from "@/lib/content";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { getSelicRate } from "@/services/brapi"; 
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return blogArticles.map((article) => ({
    slug: article.slug,
  }));
}

// Gera os metadados dinamicamente
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const article = blogArticles.find((a) => a.slug === params.slug);

  if (!article) {
    return {
      title: "Artigo não encontrado",
    };
  }

  const title = article.seoTitle || article.title;
  const excerpt = article.description; // Short description for social sharing
  const seoDescription = article.seoDescription || article.description; // Longer description for meta tag
  const image = placeholderImages.find(p => p.id === article.imageId);
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
function FaqSection({ faq }: { faq: { question: string; answer: string }[] }) {
  if (!faq || faq.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-3xl font-bold font-headline mb-6">Perguntas Frequentes</h2>
      <Accordion type="single" collapsible className="w-full">
        {faq.map((item, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger className="text-left font-semibold">{item.question}</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">{item.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}


// Make the component async to fetch data
export default async function BlogPostPage({ params }: Props) {
  const article = blogArticles.find((a) => a.slug === params.slug);

  if (!article) {
    notFound();
  }
  
  const image = placeholderImages.find(p => p.id === article.imageId);

  // --- Fetch real-time data ---
  const selicRate = await getSelicRate().catch(() => 10.50); // Default value on error
  // CDI is very close to Selic, so we can approximate.
  // CDI = SELIC - 0.10
  const cdiRate = selicRate - 0.10; 
  const cdbExampleRate = cdiRate * 1.10; // For 110% of CDI

  // --- Replace placeholders in content ---
  let dynamicContent = article.content;
  dynamicContent = dynamicContent.replace(/{{selicRate}}/g, selicRate.toFixed(2));
  dynamicContent = dynamicContent.replace(/{{cdbExampleRate}}/g, cdbExampleRate.toFixed(2));
  
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
          "dateModified": new Date(article.date).toISOString(), // Assuming date is last updated
          "author": {
              "@type": "Organization",
              "name": "SafeStart Invest"
          },
          "publisher": {
            "@type": "Organization",
            "name": "SafeStart Invest",
            "logo": {
              "@type": "ImageObject",
              "url": "/logo.png" // Placeholder, replace with actual logo URL
            }
          },
        },
        ...(article.faq ? [{
            "@type": "FAQPage",
            "mainEntity": article.faq.map(item => ({
                "@type": "Question",
                "name": item.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": item.answer,
                },
            })),
        }] : [])
      ]
    };

  return (
    <>
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
    />
    <article className="max-w-3xl mx-auto">
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

        <div 
            className="prose prose-lg max-w-none prose-h3:font-headline prose-h3:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground"
            dangerouslySetInnerHTML={{ __html: dynamicContent }} // Use the dynamic content
        />

        <FaqSection faq={article.faq || []} />
    </article>
    </>
  );
}
