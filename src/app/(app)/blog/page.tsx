import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { blogArticles, placeholderImages } from "@/lib/content";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function BlogPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-2">O Blog SafeStart</h1>
      <p className="text-muted-foreground mb-8">
        Mantenha-se informado com as últimas tendências de mercado, estratégias de investimento e sabedoria financeira, tudo escrito para iniciantes.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogArticles.map((article) => {
          const image = placeholderImages.find(p => p.id === article.imageId);
          return (
            <Link href={`/blog/${article.slug}`} key={article.slug} className="group">
              <Card className="h-full overflow-hidden transition-all group-hover:shadow-lg group-hover:-translate-y-1">
                {image && (
                    <div className="relative aspect-video">
                        <Image 
                            src={image.imageUrl} 
                            alt={image.description} 
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            data-ai-hint={image.imageHint}
                        />
                    </div>
                )}
                <CardHeader>
                  <CardTitle className="leading-snug group-hover:text-primary transition-colors">{article.title}</CardTitle>
                  <Badge variant="secondary" className="w-fit">{article.date}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{article.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
