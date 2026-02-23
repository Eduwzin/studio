import DailyNewsClient from './daily-news-client';
import { dailyNews } from '@/lib/content';
import type { DailyNewsArticle } from '@/lib/content';

// This function could later fetch real data from an API
async function getDailyNews(): Promise<DailyNewsArticle[]> {
  // We don't need a real delay here, the client component will simulate it
  return Promise.resolve(dailyNews);
}

export default async function DailyNewsPage() {
  const news = await getDailyNews();

  return <DailyNewsClient initialNews={news} />;
}
