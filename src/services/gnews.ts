/**
 * @fileOverview Service to interact with the GNews API for market news.
 */

const GNEWS_API_BASE_URL = 'https://gnews.io/api/v4';
const GNEWS_API_KEY = process.env.GNEWS_API_KEY;

export interface GNewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

/**
 * Fetches the latest financial news from the GNews API.
 * @param limit The number of news articles to fetch.
 * @returns A promise that resolves to an array of news articles.
 */
export async function getMarketNews(limit: number = 5): Promise<GNewsArticle[]> {
  if (!GNEWS_API_KEY) {
    throw new Error('GNews API key (GNEWS_API_KEY) is not configured in the environment.');
  }
  
  // Parameters for financial news in Brazil
  const category = 'business';
  const lang = 'pt';
  const country = 'br';
  
  const url = `${GNEWS_API_BASE_URL}/top-headlines?category=${category}&lang=${lang}&country=${country}&max=${limit}&apikey=${GNEWS_API_KEY}`;

  try {
    const response = await fetch(url, { next: { revalidate: 1800 } }); // 30 min cache

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`GNews API Error: ${errorData.errors.join(', ')}`);
    }

    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error("Failed to fetch news from GNews:", error);
    // In case of error, return an empty array to avoid breaking the UI
    return [];
  }
}
