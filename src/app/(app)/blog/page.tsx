
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { placeholderImages } from "@/lib/content";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
import type { Article } from '@/lib/content';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';

// Helper to initialize Firestore on the server if not already done.
// This is safe to call multiple times.
function getDb() {
  if (getApps().length) {
    return getFirestore(getApp());
  }
  const app = initializeApp(firebaseConfig);
  return getFirestore(app);
}

async function getAllArticles(): Promise<Article[]> {
  const db = getDb();
  const articlesRef = collection(db, 'articles');
  const q = query(articlesRef, orderBy('lastUpdated', 'desc'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      slug: doc.id,
      date: data.lastUpdated.toDate().toISOString(),
    } as Article;
  });
}

export default async function BlogPage() {
  const articles = await getAllArticles();

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-2">O Blog SafeStart</h1>
      <p className="text-muted-foreground mb-8">
        Mantenha-se informado com as últimas tendências de mercado, estratégias de investimento e sabedoria financeira, tudo escrito para iniciantes.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => {
          const image = placeholderImages.find(p => p.id === `blog-${article.slug}`);
          return (
            <Link href={`/blog/${article.slug}`} key={article.slug} className="group">
              <Card className="h-full overflow-hidden transition-all group-hover:shadow-lg group-hover:-translate-y-1">
                {image && (
                    <div className="relative aspect-video">
                        <Image 
                            src={image.imageUrl} 
                            alt={article.description || article.title} 
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            data-ai-hint={image.imageHint}
                        />
                    </div>
                )}
                <CardHeader>
                  <CardTitle className="leading-snug group-hover:text-primary transition-colors">{article.title}</CardTitle>
                  <Badge variant="secondary" className="w-fit">{new Date(article.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</Badge>
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
