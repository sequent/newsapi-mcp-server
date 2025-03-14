import express from 'express';
import { NewsService } from '../services/news-service';
import { NewsResponseSchema } from '../types/news';
import { z } from 'zod';

const router = express.Router();
const newsService = new NewsService();

const validCategories = [
  'business',
  'entertainment',
  'general',
  'health',
  'science',
  'sports',
  'technology'
] as const;

const NewsAPIOptionsSchemaEverything = z.object({
  q: z.string().optional(),
  searchIn: z.string().optional(),
  sources: z.string().optional(),
  domains: z.string().optional(),
  ExcludeDomains: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  language: z.string().min(2).max(2).optional(),
  sortBy: z.string().optional(),
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().min(1).max(100).optional()
});

const NewsAPIOptionsSchemaHeadlines = z.object({
  q: z.string().optional(),
  sources: z.string().optional(),
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().min(1).max(100).optional(),
  category: z.enum(validCategories).optional(),
  country: z.string().min(2).max(2).optional(),
});

const NewsAPIOptionsSchemaSources = z.object({
  category: z.enum(validCategories).optional(),
  language: z.string().min(2).max(2).optional(),
  country: z.string().min(2).max(2).optional(),
});

// Get everything
router.get('/everything', async (req, res) => {
  try {
    const options = NewsAPIOptionsSchemaEverything.parse(req.query);
    const articles = await newsService.everything(options);
    const response = NewsResponseSchema.parse({
      articles,
      timestamp: Date.now(),
    });
    
    res.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else {
      console.error('Error in everything route:', error);
      res.status(500).json({ error: 'Failed to fetch articles' });
    }
  }
});

// Get top headlines
router.get('/top-headlines', async (req, res) => {
  try {
    const options = NewsAPIOptionsSchemaHeadlines.parse(req.query);
    const articles = await newsService.topHeadlines(options);
    const response = NewsResponseSchema.parse({
      articles,
      timestamp: Date.now(),
    });
    
    res.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else {
      console.error('Error in top headlines route:', error);
      res.status(500).json({ error: 'Failed to fetch headlines' });
    }
  }
});

// Get sources
router.get('/sources', async (req, res) => {
  try {
    const options = NewsAPIOptionsSchemaSources.parse(req.query);
    const sources = await newsService.sources(options);
    res.json({
      sources,
      timestamp: Date.now(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else {
      console.error('Error in sources route:', error);
      res.status(500).json({ error: 'Failed to fetch sources' });
    }
  }
});

export const newsRouter = router; 