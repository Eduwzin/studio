import { notFound } from "next/navigation";
import { blogArticles, placeholderImages } from "@/lib/content";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { getSelicRate } from "@/services/brapi"; // Import the service

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return blogArticles.map((article) => ({
    slug: article.slug,
  }));
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
  

  return (
    <article className="max-w-3xl mx-auto">
        <header className="mb-8">
            <h1 className="text-4xl font-bold font-headline mb-2">{article.title}</h1>
            <Badge variant="outline">{article.date}</Badge>
        </header>

        {image && (
            <div className="relative aspect-video rounded-lg overflow-hidden mb-8 shadow-md">
                <Image 
                    src={image.imageUrl} 
                    alt={image.description} 
                    fill
                    className="object-cover"
                    data-ai-hint={image.imageHint}
                />
            </div>
        )}

        <div 
            className="prose prose-lg max-w-none prose-h3:font-headline prose-h3:text-foreground"
            dangerouslySetInnerHTML={{ __html: dynamicContent }} // Use the dynamic content
        />
    </article>
  );
}
