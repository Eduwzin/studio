import DailyNewsClient from './daily-news-client';
import { getDailyNewsAction } from '@/lib/actions';

export default async function DailyNewsPage() {
  const news = await getDailyNewsAction();

  return <DailyNewsClient initialNews={news} />;
}
