import NewsAPI from 'newsapi';
import { NewsArticle } from '../types/news';

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

interface NewsAPISource {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  language: string;
  country: string;
}

interface NewsAPIArticlesResponse {
  status: string;
  totalResults: number;
  articles: NewsAPIArticle[];
}

interface NewsAPISourcesResponse {
  status: string;
  sources: NewsAPISource[];
}

type NewsAPIResponse = NewsAPIArticlesResponse | NewsAPISourcesResponse;

type NewsCategory = 
  | 'business'
  | 'entertainment'
  | 'general'
  | 'health'
  | 'science'
  | 'sports'
  | 'technology';

interface NewsAPIOptions {
  q?: string;
  sources?: string;
  domains?: string;
  from?: string;
  to?: string;
  language?: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
  category?: NewsCategory;
  country?: string;
}

export class NewsService {
  private readonly newsapi: NewsAPI;
  private readonly categories: NewsCategory[] = [
    'business',
    'entertainment',
    'general',
    'health',
    'science',
    'sports',
    'technology'
  ];

  constructor() {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      throw new Error('NEWS_API_KEY environment variable is not set');
    }
    this.newsapi = new NewsAPI(apiKey);
  }

  private mapToNewsArticle(article: NewsAPIArticle): NewsArticle {
    return {
      title: article.title,
      url: article.url,
      description: article.description ?? null,
      imageUrl: article.urlToImage,
      publishedAt: new Date(article.publishedAt).toISOString(),
      category: article.source.name.toLowerCase()
    };
  }

  private validateCategory(category?: string): NewsCategory | undefined {
    if (!category) return undefined;
    
    if (!this.categories.includes(category as NewsCategory)) {
      throw new Error(`Invalid category: ${category}. Valid categories are: ${this.categories.join(', ')}`);
    }
    
    return category as NewsCategory;
  }

  private isSourcesResponse(response: NewsAPIResponse): response is NewsAPISourcesResponse {
    return 'sources' in response;
  }

  async everything(options: NewsAPIOptions = {}): Promise<NewsArticle[]> {
    try {
      console.log('Fetching everything from NewsAPI...');
      const response = await this.newsapi.v2.everything(options) as NewsAPIArticlesResponse;
      console.log(`Got ${response.articles.length} articles from NewsAPI`);

      return response.articles.map(this.mapToNewsArticle);
    } catch (error) {
      console.error('Error fetching everything:', error);
      throw new Error('Failed to fetch articles');
    }
  }

  async topHeadlines(options: NewsAPIOptions = {}): Promise<NewsArticle[]> {
    try {
      console.log('Fetching top headlines from NewsAPI...');
      const category = this.validateCategory(options.category);
      
      const response = await this.newsapi.v2.topHeadlines({
        language: 'en',
        ...options,
        ...(category && { category })
      }) as NewsAPIArticlesResponse;
      console.log(`Got ${response.articles.length} headlines from NewsAPI`);

      return response.articles.map(this.mapToNewsArticle);
    } catch (error) {
      console.error('Error fetching headlines:', error);
      throw new Error('Failed to fetch headlines');
    }
  }

  async sources(options: NewsAPIOptions = {}): Promise<NewsAPISource[]> {
    try {
      console.log('Fetching sources from NewsAPI...');
      const category = this.validateCategory(options.category);
      
      const response = await this.newsapi.v2.sources({
        ...options,
        ...(category && { category })
      });

      if (!this.isSourcesResponse(response)) {
        throw new Error('Invalid response from NewsAPI');
      }

      console.log(`Got ${response.sources.length} sources from NewsAPI`);
      return response.sources;
    } catch (error) {
      console.error('Error fetching sources:', error);
      throw new Error('Failed to fetch sources');
    }
  }
} 