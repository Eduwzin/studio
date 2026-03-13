
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
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarRange, Clock, ExternalLink, RefreshCw, Rss, Sparkles } from 'lucide-react';
import Link from 'next/link';
import type { NewsStory } from '@/ai/flows/generate-daily-news-stories';
import { Skeleton } from '@/components/ui/skeleton';
import { generateNewsStoriesAction, generateWeeklySummaryAction } from '@/lib/actions';
import { Badge } from '@/components/ui/badge';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, getDoc, setDoc, type Firestore } from 'firebase/firestore';

const extractTickersFromString = (allocationString: string | undefined): string => {
  if (!allocationString) return '';
  // Regex to find patterns like ABCD11 or ABC1
  const tickerRegex = /[A-Z]{4}\d{1,2}/g;
  const matches = allocationString.match(tickerRegex);
  return matches ? matches.join(',') : '';
};


function NewsStoryCard({ story }: { story: NewsStory }) {
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="pt-6">
        <CardTitle>{story.title}</CardTitle>
        {story.relatedTickers && story.relatedTickers.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {story.relatedTickers.map(ticker => (
              <Badge key={ticker} variant="secondary">Relacionado a: {ticker}</Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <div className="space-y-4 mb-6">
          <p className="text-muted-foreground">{story.summary}</p>
          <div>
            <h4 className="font-semibold text-sm">Por que importa?</h4>
            <p className="text-sm text-muted-foreground italic">{story.whyItMatters}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm">Impacto provável:</h4>
            <p className="text-sm text-muted-foreground italic">{story.likelyImpact}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{story.source}</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatDistanceToNow(new Date(story.publishedAt), { addSuffix: true, locale: ptBR })}</span>
            </div>
          </div>
          <Button asChild variant="outline" className="w-full">
            <Link href={story.url} target="_blank" rel="noopener noreferrer">
              Ver notícia original
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function WeeklySummaryCard({ userId, firestore }: { userId: string | undefined, firestore: Firestore | null }) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId || !firestore) {
      setIsLoading(false);
      return;
    }

    const fetchSummary = async () => {
      setIsLoading(true);
      const allStories: NewsStory[] = [];
      const today = new Date();

      const promises = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        const cacheRef = doc(firestore, 'users', userId, 'dailyNewsCache', dateString);
        promises.push(getDoc(cacheRef));
      }

      try {
        const snapshots = await Promise.all(promises);
        snapshots.forEach(snap => {
          if (snap.exists()) {
            const data = snap.data();
            if (data.stories && data.stories.length > 0) {
              allStories.push(...data.stories);
            }
          }
        });

        const uniqueStories = Array.from(new Map(allStories.map(story => [story.url, story])).values());

        const inputForFlow = {
            stories: uniqueStories.map(s => ({
                title: s.title,
                summary: s.summary,
                whyItMatters: s.whyItMatters,
                likelyImpact: s.likelyImpact,
                topics: s.topics,
            }))
        };
        
        const result = await generateWeeklySummaryAction(inputForFlow);
        setSummary(result);
      } catch (e) {
        console.error("Failed to fetch or generate weekly summary:", e);
        setSummary("Não foi possível carregar o resumo da semana. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, [userId, firestore]);

  return (
    <Card className="mt-12">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <CalendarRange className="text-primary" />
          Resumo da Semana
        </CardTitle>
        <CardDescription>
          Uma análise dos principais acontecimentos dos últimos 7 dias, gerada por IA.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : (
          <div className="flex items-start gap-3 text-muted-foreground">
            <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm whitespace-pre-line">{summary}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


export default function DailyNewsClient({ initialNews }: {initialNews: NewsStory[]}) {
  const [news, setNews] = useState(initialNews);
  const [isLoading, setIsLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, `users/${user.uid}/userProfiles/${user.uid}`);
  }, [user, firestore]);

  const { data: userProfile, isLoading: isLoadingProfile } = useDoc<any>(userProfileRef);

  const fetchNews = useCallback(async (forceRefresh = false) => {
    if (isUserLoading || isLoadingProfile || !user || !firestore) {
        if (!user && !isUserLoading) {
            setIsLoading(false);
        }
        return;
    }

    setIsLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const cacheRef = doc(firestore, 'users', user.uid, 'dailyNewsCache', today);
    const assets = extractTickersFromString(userProfile?.perfilDeInvestimento?.alocacaoDeAtivos);

    if (!forceRefresh) {
        try {
            const cacheSnap = await getDoc(cacheRef);
            if (cacheSnap.exists()) {
                const data = cacheSnap.data();
                if (data.stories && data.stories.length > 0 && data.userAssets === assets) {
                    setNews(data.stories);
                    setIsLoading(false);
                    return;
                }
            }
        } catch (e) {
            console.error("Error reading from news cache, fetching fresh news.", e);
        }
    }

    try {
        const refreshedNews = await generateNewsStoriesAction({
            userAssets: assets,
        });
        setNews(refreshedNews);

        if (refreshedNews.length > 0) {
            try {
                await setDoc(cacheRef, {
                    stories: refreshedNews,
                    userAssets: assets,
                    createdAt: new Date().toISOString()
                });
            } catch (e) {
                console.error("Failed to write to news cache:", e);
            }
        }
    } catch (e) {
        console.error("Failed to fetch news:", e);
        setNews([]);
    } finally {
        setIsLoading(false);
    }
  }, [user, firestore, userProfile, isLoadingProfile, isUserLoading]);


  useEffect(() => {
    fetchNews(false);
  }, [fetchNews]);

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
          <Card className="min-h-[450px] flex flex-col justify-between">
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
               <Skeleton className="h-4 w-1/4 mt-2" />
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              <div className="space-y-2">
                 <Skeleton className="h-4 w-1/3" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-5/6" />
              </div>
               <Skeleton className="h-10 w-full mt-6" />
            </CardContent>
          </Card>
        ) : (
          <Carousel setApi={setApi} className="w-full">
            <CarouselContent>
              {news.length > 0 ? news.map((story, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <NewsStoryCard story={story} />
                  </div>
                </CarouselItem>
              )) : (
                <CarouselItem>
                  <div className="p-1">
                    <Card className="min-h-[450px] flex flex-col items-center justify-center text-center">
                      <CardHeader>
                        <CardTitle>Nenhuma notícia encontrada</CardTitle>
                        <CardDescription>Não foi possível carregar seu resumo de notícias hoje. Tente atualizar mais tarde.</CardDescription>
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
          <Button onClick={() => fetchNews(true)} disabled={isLoading} variant="outline">
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            {count > 0 && current > 0 ? `${current} de ${count}` : ''}
          </div>
        </div>
      </div>
      {user && <WeeklySummaryCard userId={user.uid} firestore={firestore} />}
    </div>
  );
}
