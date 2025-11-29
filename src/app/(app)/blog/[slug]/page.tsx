import { notFound } from "next/navigation";
import { blogArticles, placeholderImages } from "@/lib/content";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return blogArticles.map((article) => ({
    slug: article.slug,
  }));
}

export default function BlogPostPage({ params }: Props) {
  const article = blogArticles.find((a) => a.slug === params.slug);

  if (!article) {
    notFound();
  }
  
  const image = placeholderImages.find(p => p.id === article.imageId);

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
            dangerouslySetInnerHTML={{ __html: article.content }}
        />
    </article>
  );
}
