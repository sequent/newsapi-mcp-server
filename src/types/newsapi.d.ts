import { NewsAPIArticle } from './news';

declare module 'newsapi' {
  export interface NewsAPIResponse {
    status: string;
    totalResults: number;
    articles: NewsAPIArticle[];
  }

  export interface NewsAPIOptions {
    q?: string;
    sources?: string;
    domains?: string;
    excludeDomains?: string;
    from?: string;
    to?: string;
    language?: string;
    sortBy?: string;
    page?: number;
    pageSize?: number;
    category?: string;
    country?: string;
  }

  export default class NewsAPI {
    constructor(apiKey: string);
    
    v2: {
      topHeadlines(options: NewsAPIOptions): Promise<NewsAPIResponse>;
      everything(options: NewsAPIOptions): Promise<NewsAPIResponse>;
      sources(options: NewsAPIOptions): Promise<NewsAPIResponse>;
    };
  }
} 