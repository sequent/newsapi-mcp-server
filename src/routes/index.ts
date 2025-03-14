import express from 'express';

const router = express.Router();

const validCategories = [
  'business',
  'entertainment',
  'general',
  'health',
  'science',
  'sports',
  'technology'
] as const;

// Common parameter definitions
const baseParameters = {
  page: {
    in: 'query',
    type: 'integer',
    description: 'Page number for paginated results',
    required: false,
    default: 1,
    minimum: 1,
    example: 1
  },
  pageSize: {
    in: 'query',
    type: 'integer',
    description: 'Number of results per page',
    required: false,
    default: 100,
    minimum: 1,
    maximum: 100,
    example: 20
  }
};

const languageParameter = {
  in: 'query',
  type: 'string',
  description: 'Two-letter language code',
  pattern: '^[a-z]{2}$',
  required: false,
  default: 'en',
  example: 'en',
  enum: ['ar', 'de', 'en', 'es', 'fr', 'he', 'it', 'nl', 'no', 'pt', 'ru', 'sv', 'ud', 'zh']
};

const countryParameter = {
  in: 'query',
  type: 'string',
  description: 'Two-letter country code',
  pattern: '^[a-z]{2}$',
  required: false,
  default: 'us',
  example: 'us',
  enum: [
    'ae', 'ar', 'at', 'au', 'be', 'bg', 'br', 'ca', 'ch', 'cn', 'co', 'cu', 'cz',
    'de', 'eg', 'fr', 'gb', 'gr', 'hk', 'hu', 'id', 'ie', 'il', 'in', 'it', 'jp',
    'kr', 'lt', 'lv', 'ma', 'mx', 'my', 'ng', 'nl', 'no', 'nz', 'ph', 'pl', 'pt',
    'ro', 'rs', 'ru', 'sa', 'se', 'sg', 'si', 'sk', 'th', 'tr', 'tw', 'ua', 'us',
    've', 'za'
  ]
};

const categoryParameter = {
  in: 'query',
  type: 'string',
  description: 'Category of news to retrieve',
  required: false,
  enum: validCategories,
  example: 'technology'
};

// Endpoint-specific parameter sets
const everythingParameters = {
  q: {
    in: 'query',
    type: 'string',
    description: 'Keywords or phrases to search for in the article title and body',
    required: false,
    example: 'bitcoin OR cryptocurrency',
    note: 'Advanced search is supported: AND, OR, NOT operators and grouping with parentheses'
  },
  searchIn: {
    in: 'query',
    type: 'string',
    description: 'The fields to restrict your q search to',
    required: false,
    example: 'title,description',
    note: 'Possible options: title, description, content'
  },
  sources: {
    in: 'query',
    type: 'string',
    description: 'Comma-separated string of news source IDs to restrict the search to',
    required: false,
    example: 'bbc-news,cnn',
    note: 'Use the /sources endpoint to get available source IDs'
  },
  domains: {
    in: 'query',
    type: 'string',
    description: 'Comma-separated string of domains to restrict the search to',
    required: false,
    example: 'bbc.co.uk,techcrunch.com'
  },
  ExcludeDomains: {
    in: 'query',
    type: 'string',
    description: 'Comma-separated string of domains to exclude from the results',
    required: false,
    example: 'example.com,fake-news.com'
  },
  from: {
    in: 'query',
    type: 'string',
    format: 'date-time',
    description: 'Start date for article search',
    required: false,
    example: '2024-03-01',
    note: 'Date should be in ISO 8601 format (e.g., 2024-03-01 or 2024-03-01T12:00:00Z)'
  },
  to: {
    in: 'query',
    type: 'string',
    format: 'date-time',
    description: 'End date for article search',
    required: false,
    example: '2024-03-14',
    note: 'Date should be in ISO 8601 format (e.g., 2024-03-01 or 2024-03-01T12:00:00Z)'
  },
  sortBy: {
    in: 'query',
    type: 'string',
    description: 'Sort order for articles',
    required: false,
    enum: ['relevancy', 'popularity', 'publishedAt'],
    default: 'publishedAt',
    example: 'publishedAt',
    note: 'relevancy = articles more closely related to q come first\npopularity = articles from popular sources and publishers come first\npublishedAt = newest articles come first'
  },
  language: languageParameter,
  ...baseParameters
};

const headlinesParameters = {
  q: {
    in: 'query',
    type: 'string',
    description: 'Keywords or phrases to search for in the article title and body',
    required: false,
    example: 'bitcoin'
  },
  sources: {
    in: 'query',
    type: 'string',
    description: 'Comma-separated string of news source IDs',
    required: false,
    example: 'bbc-news,cnn',
    note: 'Cannot be mixed with country or category parameters'
  },
  category: categoryParameter,
  country: countryParameter,
  ...baseParameters
};

const sourcesParameters = {
  category: categoryParameter,
  language: languageParameter,
  country: countryParameter
};

// API Documentation
router.get('/', (req, res) => {
  console.log('API documentation endpoint hit');
  const apiDocs = {
    info: {
      name: 'News API',
      version: '1.0.0',
      description: 'A RESTful API for retrieving news articles and sources from NewsAPI.org',
      contact: {
        email: 'support@example.com',
        url: 'https://example.com/support'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api/news',
        description: 'Development server'
      }
    ],
    security: [
      {
        apiKey: {
          type: 'apiKey',
          name: 'X-Api-Key',
          in: 'header',
          description: 'API key for authentication'
        }
      }
    ],
    endpoints: {
      '/everything': {
        get: {
          summary: 'Search all articles',
          description: 'Search through millions of articles from over 80,000 large and small news sources and blogs',
          parameters: everythingParameters,
          response: {
            200: {
              description: 'Successful response',
              content: {
                articles: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/article' }
                },
                timestamp: {
                  type: 'integer',
                  description: 'Current timestamp in milliseconds'
                }
              }
            },
            400: {
              description: 'Bad request - validation error'
            },
            401: {
              description: 'Unauthorized - invalid API key'
            },
            429: {
              description: 'Too many requests - rate limit exceeded'
            }
          },
          examples: [
            {
              description: 'Search for bitcoin news',
              request: '/api/news/everything?q=bitcoin&language=en&sortBy=publishedAt'
            },
            {
              description: 'Search tech news from specific sources',
              request: '/api/news/everything?q=technology&sources=techcrunch,wired&language=en'
            },
            {
              description: 'Search news within date range excluding certain domains',
              request: '/api/news/everything?q=climate&from=2024-03-01&to=2024-03-14&sortBy=popularity&excludeDomains=example.com'
            }
          ]
        }
      },
      '/top-headlines': {
        get: {
          summary: 'Get top headlines',
          description: 'Returns breaking news headlines for countries, categories, and singular publishers',
          parameters: headlinesParameters,
          response: {
            200: {
              description: 'Successful response',
              content: {
                articles: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/article' }
                },
                timestamp: {
                  type: 'integer',
                  description: 'Current timestamp in milliseconds'
                }
              }
            },
            400: {
              description: 'Bad request - validation error'
            },
            401: {
              description: 'Unauthorized - invalid API key'
            },
            429: {
              description: 'Too many requests - rate limit exceeded'
            }
          },
          examples: [
            {
              description: 'Get US technology headlines',
              request: '/api/news/top-headlines?category=technology&country=us'
            },
            {
              description: 'Search headlines from specific sources',
              request: '/api/news/top-headlines?sources=bbc-news,cnn'
            }
          ]
        }
      },
      '/sources': {
        get: {
          summary: 'Get news sources',
          description: 'Returns information about news publishers available through the API',
          parameters: sourcesParameters,
          response: {
            200: {
              description: 'Successful response',
              content: {
                sources: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/source' }
                },
                timestamp: {
                  type: 'integer',
                  description: 'Current timestamp in milliseconds'
                }
              }
            },
            400: {
              description: 'Bad request - validation error'
            },
            401: {
              description: 'Unauthorized - invalid API key'
            },
            429: {
              description: 'Too many requests - rate limit exceeded'
            }
          },
          examples: [
            {
              description: 'Get English business sources',
              request: '/api/news/sources?category=business&language=en'
            }
          ]
        }
      }
    },
    components: {
      schemas: {
        article: {
          type: 'object',
          required: ['title', 'url', 'publishedAt'],
          properties: {
            title: {
              type: 'string',
              description: 'The headline or title of the article'
            },
            url: {
              type: 'string',
              format: 'uri',
              description: 'The direct URL to the article'
            },
            description: {
              type: ['string', 'null'],
              description: 'A description or snippet from the article'
            },
            imageUrl: {
              type: ['string', 'null'],
              format: 'uri',
              description: 'The URL to a relevant image for the article'
            },
            publishedAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date and time the article was published'
            },
            category: {
              type: 'string',
              description: 'The category of the article'
            }
          }
        },
        source: {
          type: 'object',
          required: ['id', 'name'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier of the news source'
            },
            name: {
              type: 'string',
              description: 'Display name of the news source'
            },
            description: {
              type: 'string',
              description: 'A description of the news source'
            },
            url: {
              type: 'string',
              format: 'uri',
              description: 'The base URL of the news source'
            },
            category: {
              type: 'string',
              description: 'Main category of the news source'
            },
            language: {
              type: 'string',
              description: 'Language of the news source using ISO 639-1 codes'
            },
            country: {
              type: 'string',
              description: 'Country of the news source using ISO 3166-1 codes'
            }
          }
        }
      }
    }
  };

  res.json(apiDocs);
});

export default router; 