'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, ExternalLink, RefreshCw, Rss } from 'lucide-react';
import Link from 'next/link';
import type { DailyNewsArticle } from '@/lib/content';
import { Skeleton } from '@/components/ui/skeleton';
import { getDailyNewsAction } from '@/lib/actions';
import Image from 'next/image';

type DailyNewsClientProps = {
  initialNews: DailyNewsArticle[];
};

function NewsStoryCard({ story }: { story: DailyNewsArticle }) {
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      {story.imageUrl && (
        <div className="relative aspect-video w-full">
          <Image
            src={story.imageUrl}
            alt={story.title}
            fill
            className="object-cover"
            unoptimized // Brapi images might not be standard sizes
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <CardHeader className={!story.imageUrl ? 'pt-6' : ''}>
        <CardTitle>{story.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <p className="text-muted-foreground mb-6">{story.summary}</p>
        <div className="space-y-4">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>{story.source}</span>
                <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{story.time}</span>
                </div>
            </div>
             <Button asChild variant="outline" className="w-full">
                <Link href={story.link} target="_blank" rel="noopener noreferrer">
                    Ver notícia
                    <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}


export default function DailyNewsClient({ initialNews }: DailyNewsClientProps) {
  const [news, setNews] = useState(initialNews);
  const [isLoading, setIsLoading] = useState(initialNews.length === 0);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    const refreshedNews = await getDailyNewsAction();
    setNews(refreshedNews);
    setIsLoading(false);
  }, []);
  
  useEffect(() => {
    if (initialNews.length === 0 && !isLoading) {
      handleRefresh();
    }
  }, [initialNews, handleRefresh, isLoading]);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api, news]); // Add news to dependency array to update count on refresh

  const today = format(new Date(), "eeee, dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });

  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
            <Rss className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline">Notícias do Dia</h1>
        </div>
        <p className="text-muted-foreground capitalize">{today}</p>
      </header>

      <div className="relative">
         {isLoading ? (
            <Card className="h-[550px]">
                <Skeleton className="h-[200px] w-full" />
                <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-4 pt-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <div className="pt-12">
                      <Skeleton className="h-10 w-full"/>
                    </div>
                </CardContent>
            </Card>
         ) : (
            <Carousel setApi={setApi} className="w-full">
                <CarouselContent>
                {news.length > 0 ? news.map(story => (
                    <CarouselItem key={story.id}>
                        <div className="p-1 h-[550px]">
                            <NewsStoryCard story={story} />
                        </div>
                    </CarouselItem>
                )) : (
                  <CarouselItem>
                    <div className="p-1 h-[550px]">
                      <Card className="h-full flex flex-col items-center justify-center text-center">
                        <CardHeader>
                          <CardTitle>Nenhuma notícia encontrada</CardTitle>
                          <CardDescription>Não foi possível carregar as notícias. Tente atualizar.</CardDescription>
                        </CardHeader>
                      </Card>
                    </div>
                  </CarouselItem>
                )}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
            </Carousel>
         )}

        <div className="flex items-center justify-center gap-4 mt-6">
            <Button onClick={handleRefresh} disabled={isLoading} variant="outline">
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <div className="text-center text-sm text-muted-foreground">
                {count > 0 && current > 0 ? `${current} de ${count}` : ''}
            </div>
        </div>
      </div>
    </div>
  );
}
