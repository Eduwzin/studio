import DailyNewsClient from './daily-news-client';
import { getDailyNewsAction } from '@/lib/actions';
import type { NewsStory } from '@/lib/content';

export default async function DailyNewsPage() {
  const stories: NewsStory[] = await getDailyNewsAction();

  return <DailyNewsClient initialNews={stories} />;
}
