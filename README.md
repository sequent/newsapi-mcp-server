# NewsAPI Service

A RESTful API service that wraps the NewsAPI.org endpoints to provide news articles, top headlines, and news sources. Built with Node.js, TypeScript, and Docker.

## Features

- Get news articles with search and filtering
- Get top headlines by category and country
- Get news sources with filtering
- Pagination support
- Docker containerization
- Health check endpoint
- TypeScript for type safety

## Prerequisites

- Node.js 20.x or Docker
- NewsAPI.org API key (get it from [https://newsapi.org/register](https://newsapi.org/register))

## Environment Variables

Create a `.env` file in the root directory:

```env
NEWS_API_KEY=your_api_key_here
NODE_ENV=development # or production
PORT=3000 # optional, defaults to 3000
```

## Installation

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd newsapi_news
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Docker Deployment

1. Build and start the container:
```bash
docker-compose up --build
```

2. Stop the container:
```bash
docker-compose down
```

## API Endpoints

### GET /api/news/everything
Get articles based on search criteria.

**Parameters:**
- `q` (required): Keywords or phrases to search for in the article title and body
- `qInTitle`: Keywords or phrases to search for in the article title only
- `sources`: Comma-separated string of news source IDs (e.g., 'bbc-news,techcrunch')
- `domains`: Comma-separated string of domains to restrict the search to (e.g., 'bbc.co.uk,techcrunch.com')
- `excludeDomains`: Comma-separated string of domains to exclude from the search
- `from`: ISO 8601 formatted date (e.g., '2025-03-14' or '2025-03-14T09:15:00Z')
- `to`: ISO 8601 formatted date
- `language`: 2-letter ISO-639-1 language code. Available options:
  - `ar` Arabic
  - `de` German
  - `en` English
  - `es` Spanish
  - `fr` French
  - `he` Hebrew
  - `it` Italian
  - `nl` Dutch
  - `no` Norwegian
  - `pt` Portuguese
  - `ru` Russian
  - `sv` Swedish
  - `zh` Chinese
- `sortBy`: The order to sort articles in. Available options:
  - `relevancy`: Articles more closely related to the search query
  - `popularity`: Articles from popular sources and publishers
  - `publishedAt`: Newest articles first
- `page`: Page number for paginated results (default: 1)
- `pageSize`: Number of results per page (default: 20, max: 100)

**Example:**
```bash
curl "http://localhost:3000/api/news/everything?q=bitcoin&language=en&sortBy=publishedAt&page=1&pageSize=5&domains=techcrunch.com,theverge.com"
```

### GET /api/news/top-headlines
Get top headlines by category and country.

**Parameters:**
- `category`: The category to get headlines for. Available options:
  - `business`
  - `entertainment`
  - `general`
  - `health`
  - `science`
  - `sports`
  - `technology`
- `country`: The 2-letter ISO 3166-1 country code. Available options:
  - `ae` UAE
  - `ar` Argentina
  - `at` Austria
  - `au` Australia
  - `be` Belgium
  - `bg` Bulgaria
  - `br` Brazil
  - `ca` Canada
  - `ch` Switzerland
  - `cn` China
  - `co` Colombia
  - `cu` Cuba
  - `cz` Czech Republic
  - `de` Germany
  - `eg` Egypt
  - `fr` France
  - `gb` United Kingdom
  - `gr` Greece
  - `hk` Hong Kong
  - `hu` Hungary
  - `id` Indonesia
  - `ie` Ireland
  - `il` Israel
  - `in` India
  - `it` Italy
  - `jp` Japan
  - `kr` South Korea
  - `lt` Lithuania
  - `lv` Latvia
  - `ma` Morocco
  - `mx` Mexico
  - `my` Malaysia
  - `ng` Nigeria
  - `nl` Netherlands
  - `no` Norway
  - `nz` New Zealand
  - `ph` Philippines
  - `pl` Poland
  - `pt` Portugal
  - `ro` Romania
  - `rs` Serbia
  - `ru` Russia
  - `sa` Saudi Arabia
  - `se` Sweden
  - `sg` Singapore
  - `si` Slovenia
  - `sk` Slovakia
  - `th` Thailand
  - `tr` Turkey
  - `tw` Taiwan
  - `ua` Ukraine
  - `us` United States
  - `ve` Venezuela
  - `za` South Africa
- `sources`: Comma-separated string of news source IDs (e.g., 'bbc-news,techcrunch')
  Note: Cannot be mixed with `country` or `category` parameters
- `q`: Keywords or phrases to search for in headlines
- `page`: Page number for paginated results (default: 1)
- `pageSize`: Number of results per page (default: 20, max: 100)

**Example:**
```bash
curl "http://localhost:3000/api/news/top-headlines?category=technology&country=us&page=1&pageSize=5&q=AI"
```

### GET /api/news/sources
Get news sources with filtering.

**Parameters:**
- `category`: Filter sources by category. Available options:
  - `business`
  - `entertainment`
  - `general`
  - `health`
  - `science`
  - `sports`
  - `technology`
- `language`: Filter sources by language. Uses 2-letter ISO-639-1 codes:
  - `ar` Arabic
  - `de` German
  - `en` English
  - `es` Spanish
  - `fr` French
  - `he` Hebrew
  - `it` Italian
  - `nl` Dutch
  - `no` Norwegian
  - `pt` Portuguese
  - `ru` Russian
  - `sv` Swedish
  - `zh` Chinese
- `country`: Filter sources by country. Uses 2-letter ISO 3166-1 codes (same as top-headlines)

**Example:**
```bash
curl "http://localhost:3000/api/news/sources?category=business&language=en&country=us"
```

## Response Format

### Articles Response
```json
{
  "articles": [
    {
      "title": "Article Title",
      "url": "https://article.url",
      "description": "Article description",
      "imageUrl": "https://image.url",
      "publishedAt": "2025-03-14T10:00:00Z",
      "category": "technology"
    }
  ],
  "timestamp": 1741944027694
}
```

### Sources Response
```json
{
  "sources": [
    {
      "id": "source-id",
      "name": "Source Name",
      "description": "Source description",
      "url": "https://source.url",
      "category": "business",
      "language": "en",
      "country": "us"
    }
  ],
  "timestamp": 1741944027694
}
```

## Error Handling

The API returns appropriate HTTP status codes:
- 200: Success
- 400: Bad Request (invalid parameters)
- 401: Unauthorized (invalid API key)
- 429: Too Many Requests
- 500: Internal Server Error

## Development

```bash
# Run tests
npm test

# Build TypeScript
npm run build

# Start production server
npm start
```

## License

MIT