/**
 * @fileOverview Service to interact with the GNews API for market news.
 */

const GNEWS_API_BASE_URL = 'https://gnews.io/api/v4';
// IMPORTANT: This key is for demonstration purposes. In a real application,
// this should be stored securely as an environment variable.
const GNEWS_API_KEY = 'ce6bf6b6d877e9a1c2f667d4df2bb568';

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
export async function getMarketNews(limit: number = 10): Promise<GNewsArticle[]> {
  if (!GNEWS_API_KEY) {
    throw new Error('GNews API key is not configured.');
  }
  
  // Parameters for top business headlines in Brazil
  const topic = 'business';
  const lang = 'pt';
  const country = 'br';

  const url = `${GNEWS_API_BASE_URL}/top-headlines?topic=${topic}&lang=${lang}&country=${country}&max=${limit}&apikey=${GNEWS_API_KEY}`;

  try {
    const response = await fetch(url, { cache: 'no-store' }); // Always fetch fresh data

    if (!response.ok) {
      const errorData = await response.json();
      console.error("GNews API Error:", errorData);
      throw new Error(`GNews API Error: ${errorData.errors.join(', ')}`);
    }

    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error("Failed to fetch news from GNews:", error);
    // Return an empty array to avoid breaking the app if GNews fails
    return [];
  }
}
