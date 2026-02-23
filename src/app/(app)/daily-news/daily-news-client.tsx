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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, ExternalLink, RefreshCw, Rss } from 'lucide-react';
import Link from 'next/link';
import type { DailyNewsArticle } from '@/lib/content';
import { dailyNews as mockNews } from '@/lib/content';
import { Skeleton } from '@/components/ui/skeleton';

type DailyNewsClientProps = {
  initialNews: DailyNewsArticle[];
};

function NewsStoryCard({ story }: { story: DailyNewsArticle }) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
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
                <Link href={story.link} target="_blank">
                    Ver notícia
                    <ExternalLink className="ml-2" />
                </Link>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DailyNewsClient({ initialNews }: DailyNewsClientProps) {
  const [news, setNews] = useState(initialNews);
  const [isLoading, setIsLoading] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real app, you'd fetch new data here. We'll just shuffle the mock data for a visual effect.
    setNews([...mockNews].sort(() => Math.random() - 0.5));
    setIsLoading(false);
  }, []);
  
  // Set initial loading state to true for the first render simulation
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

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
            <Card className="h-[450px]">
                <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-4 pt-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <div className="pt-20">
                      <Skeleton className="h-10 w-full"/>
                    </div>
                </CardContent>
            </Card>
         ) : (
            <Carousel setApi={setApi} className="w-full">
                <CarouselContent>
                {news.map(story => (
                    <CarouselItem key={story.id}>
                        <div className="p-1 h-[450px]">
                            <NewsStoryCard story={story} />
                        </div>
                    </CarouselItem>
                ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
            </Carousel>
         )}

        <div className="flex items-center justify-center gap-4 mt-6">
            <Button onClick={handleRefresh} disabled={isLoading} variant="outline">
              <RefreshCw className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <div className="text-center text-sm text-muted-foreground">
                {current > 0 ? `${current} de ${count}` : ''}
            </div>
        </div>
      </div>
    </div>
  );
}
