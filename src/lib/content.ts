import type { ImagePlaceholder } from './placeholder-images';
import data from './placeholder-images.json';

export const placeholderImages: ImagePlaceholder[] = data.placeholderImages;

export type Article = {
  slug: string;
  title: string;
  description: string;
  date: string;
  imageId: string;
  content: string;
};

export const blogArticles: Article[] = [
  {
    slug: 'navigating-market-trends-in-2024',
    title: 'Navigating Market Trends in 2024',
    description: 'A look into the current market trends and what they mean for beginner investors. We cover key sectors to watch and how to interpret market signals.',
    date: 'July 15, 2024',
    imageId: 'blog-market-trends',
    content: `
      <p>The year 2024 has presented a unique set of challenges and opportunities for investors. With inflation rates stabilizing and technology sectors booming, it's a crucial time to understand the landscape. For beginners, it's essential not to get caught up in the hype. Focus on long-term trends rather than short-term fluctuations.</p>
      <h3 class="font-bold text-lg my-4">Key Sectors to Watch</h3>
      <ul class="list-disc list-inside space-y-2 mb-4">
        <li><strong>Technology:</strong> AI and machine learning continue to drive innovation and growth. Companies investing heavily in R&D are poised for long-term success.</li>
        <li><strong>Renewable Energy:</strong> With a global push towards sustainability, renewable energy stocks offer significant growth potential.</li>
        <li><strong>Healthcare:</strong> An aging global population and advancements in medical technology make healthcare a resilient sector.</li>
      </ul>
      <p>Remember, diversification is key. Don't put all your eggs in one basket. Spread your investments across different sectors and asset classes to mitigate risk.</p>
    `,
  },
  {
    slug: 'a-beginners-guide-to-investing',
    title: 'A Beginner\'s Guide to Investing',
    description: 'New to investing? This guide breaks down the basics, from understanding stocks and bonds to setting up your first investment account.',
    date: 'July 10, 2024',
    imageId: 'blog-beginner-guide',
    content: `
      <p>Starting your investment journey can feel daunting, but it's simpler than you think. The first step is to define your financial goals. Are you saving for retirement, a down payment on a house, or something else? Your goals will determine your investment strategy.</p>
      <h3 class="font-bold text-lg my-4">Core Concepts</h3>
      <ul class="list-disc list-inside space-y-2 mb-4">
        <li><strong>Stocks:</strong> A share of ownership in a company. They offer high growth potential but also come with higher risk.</li>
        <li><strong>Bonds:</strong> A loan made to an entity (like a government or corporation). They are generally safer than stocks but offer lower returns.</li>
        <li><strong>Mutual Funds & ETFs:</strong> Collections of stocks, bonds, and other assets. They are a great way to diversify your portfolio easily.</li>
      </ul>
      <p>Before you invest, make sure you have an emergency fund covering 3-6 months of living expenses. Once you're ready, you can open an investment account with a brokerage firm. Start small, stay consistent, and let the power of compounding work for you.</p>
    `,
  },
  {
    slug: 'how-ai-is-changing-investment-strategies',
    title: 'How AI is Changing Investment Strategies',
    description: 'Explore the role of Artificial Intelligence in modern investing and how platforms like SafeStart Invest leverage AI to empower users.',
    date: 'July 5, 2024',
    imageId: 'blog-ai-investing',
    content: `
      <p>Artificial Intelligence (AI) is no longer a futuristic concept; it's a powerful tool that's transforming the financial industry. For investors, AI offers unprecedented capabilities for analysis, personalization, and risk management.</p>
      <h3 class="font-bold text-lg my-4">AI's Role in Investing</h3>
      <ul class="list-disc list-inside space-y-2 mb-4">
        <li><strong>Data Analysis:</strong> AI can process vast amounts of market data, news, and social media sentiment in real-time to identify trends that human analysts might miss.</li>
        <li><strong>Personalization:</strong> AI algorithms can analyze an individual's financial situation, goals, and risk tolerance to create truly personalized investment portfolios, just like we do at SafeStart Invest.</li>
        <li><strong>Risk Management:</strong> By simulating market scenarios and stress-testing portfolios, AI helps in identifying potential risks and suggesting strategies to mitigate them.</li>
      </ul>
      <p>At SafeStart Invest, we harness the power of AI to demystify investing for beginners. Our platform provides you with data-driven insights and personalized guidance, helping you make smarter, more confident investment decisions.</p>
    `,
  },
];

export type EduTopic = {
  id: string;
  title: string;
  content: string;
  imageId: string;
}

export const educationalContent: EduTopic[] = [
    {
        id: 'what-are-stocks',
        title: 'What Are Stocks?',
        imageId: 'learn-stocks',
        content: "A stock, also known as equity, represents a share of ownership in a company. When you buy a company's stock, you're purchasing a small piece of that company. If the company does well, the value of your stock may increase. If it does poorly, the value may decrease. Stocks are a popular investment for those seeking long-term growth."
    },
    {
        id: 'understanding-bonds',
        title: 'Understanding Bonds',
        imageId: 'learn-bonds',
        content: "A bond is essentially a loan from an investor to a borrower. The borrower could be a corporation or a government. The investor receives periodic interest payments (called coupons) over the life of thebond, and the principal amount is returned at maturity. Bonds are generally considered a safer investment than stocks."
    },
    {
        id: 'diversification-101',
        title: 'Diversification 101',
        imageId: 'learn-diversification',
        content: "Diversification is the practice of spreading your investments across various assets to reduce risk. The idea is that if one investment performs poorly, others may perform well, balancing out your overall portfolio. A common phrase you'll hear is 'Don't put all your eggs in one basket.' A well-diversified portfolio might include a mix of stocks, bonds, and other asset classes."
    }
];
