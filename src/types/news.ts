import { z } from 'zod';

// NewsAPI types
interface NewsAPIArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

// Our standardized article schema
export const NewsArticleSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  description: z.string().nullable(),
  imageUrl: z.string().url().nullable(),
  publishedAt: z.string().datetime(),
  category: z.string(),
});

export type NewsArticle = z.infer<typeof NewsArticleSchema>;

export const NewsResponseSchema = z.object({
  articles: z.array(NewsArticleSchema),
  timestamp: z.number(),
});

export type NewsResponse = z.infer<typeof NewsResponseSchema>;

// Export NewsAPI types
export type { NewsAPIArticle }; 