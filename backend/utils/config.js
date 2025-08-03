/**
 * Configuration for Zerodha API requests
 * Contains headers, cookies, and URL generation
 */

// Stock configuration - can be changed for different stocks
const STOCK_CONFIG = {
  symbol: 'AIRAN',  // Change this for different stocks
  exchange: 'NSE',      // BSE or NSE
  company_name: 'nah'  // Company name for display
};

// User agents for rotation - more realistic and diverse
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/121.0.0.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
];

// Referer URLs for rotation - more diverse sources
const REFERERS = [
  'https://www.google.com/',
  'https://www.google.com/search?q=zerodha+stock+market',
  'https://www.bing.com/',
  'https://www.bing.com/search?q=zerodha+stocks',
  'https://zerodha.com/',
  'https://zerodha.com/markets/',
  'https://zerodha.com/markets/stocks/',
  'https://www.yahoo.com/',
  'https://www.yahoo.com/finance/',
  'https://www.reddit.com/r/IndianStreetBets/',
  'https://www.moneycontrol.com/',
  'https://www.nseindia.com/',
  'https://www.bseindia.com/',
  'https://www.investing.com/',
  'https://www.tradingview.com/'
];

// Enhanced common headers for better anti-detection
const COMMON_HEADERS = {
  'Host': 'zerodha.com',
  'Sec-Ch-Ua': '"Not)A;Brand";v="8", "Chromium";v="138"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Ua-Platform': '"macOS"',
  'Accept-Language': 'en-GB,en;q=0.9',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
  'Sec-Fetch-Site': 'same-origin',
  'Priority': 'u=0, i',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Accept-Encoding': 'gzip, deflate, br',
  'DNT': '1',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-User': '?1',
  'Sec-Fetch-Dest': 'document',
  'Cache-Control': 'max-age=0'
};

// Headers for the main stock page request
const STOCK_PAGE_HEADERS = {
  ...COMMON_HEADERS,
  'Cache-Control': 'max-age=0',
  'Upgrade-Insecure-Requests': '1',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-User': '?1',
  'Sec-Fetch-Dest': 'document'
};

// Headers for API requests (JSON endpoints) - will be updated with correct Referer
const API_HEADERS = {
  ...COMMON_HEADERS,
  'X-Requested-With': 'XMLHttpRequest',
  'Accept': '*/*',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Dest': 'empty',
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest'
};

// Headers for price API (different priority) - will be updated with correct Referer
const PRICE_API_HEADERS = {
  ...COMMON_HEADERS,
  'X-Requested-With': 'XMLHttpRequest',
  'Accept': '*/*',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Dest': 'empty',
  'Priority': 'u=1, i',  // Different priority for price API
  'Content-Type': 'application/json'
};

// Enhanced cookies for better session management
const COOKIES = {
  '__cf_bm': 'ABRm3PRXMGRMsqKT.G10Ss1BrChZNv9UydAOhBLA1GE-1754131328-1.0.1.1-ydu_aQWAuVX0PdgEXguAI6.pusPAsP4VMU0tux5F0lyrb53njS5azPfDCyAhq9EOcFesKOF2K8zX.jApNbjA83k1iIudvP5bmikANvK6Hr4',
  '_cfuvid': '33wbPqQLzUzdk6_4nt2_cYbspVwnrouAqulcxIVINaY-1754131328928-0.0.1.1-604800000',
  'sessionid': 'random_session_id_' + Math.random().toString(36).substring(7),
  'csrftoken': 'random_csrf_token_' + Math.random().toString(36).substring(7),
  'device_id': 'random_device_id_' + Math.random().toString(36).substring(7)
};

/**
 * Generate URLs for a given stock symbol and exchange
 * @param {string} symbol - Stock symbol
 * @param {string} exchange - Exchange
 * @returns {Object} Dictionary of URLs
 */
function getUrls(symbol = null, exchange = null) {
  if (symbol === null) symbol = STOCK_CONFIG.symbol;
  if (exchange === null) exchange = STOCK_CONFIG.exchange;
  
  const baseUrl = `https://zerodha.com/markets/stocks/${exchange}/${symbol}`;
  
  return {
    stockPage: `${baseUrl}/`,
    financialsApi: `${baseUrl}/financials/`,
    peersApi: `${baseUrl}/peers/`,
    priceApi: `${baseUrl}/price/`,
    revenueMixApi: `${baseUrl}/revenue_mix/`,
    shareholdingsApi: `${baseUrl}/shareholdings/`
  };
}

/**
 * Generate API endpoint configurations for a given stock
 * @param {string} symbol - Stock symbol
 * @param {string} exchange - Exchange
 * @returns {Object} Dictionary of API endpoint configurations
 */
function getApiEndpoints(symbol = null, exchange = null) {
  const urls = getUrls(symbol, exchange);
  
  return {
    financials: {
      url: urls.financialsApi,
      headers: { ...API_HEADERS },
      name: 'financials API'
    },
    peers: {
      url: urls.peersApi,
      headers: { ...API_HEADERS },
      name: 'peers API'
    },
    price: {
      url: urls.priceApi,
      headers: { ...PRICE_API_HEADERS },
      name: 'price API'
    },
    revenueMix: {
      url: urls.revenueMixApi,
      headers: { ...API_HEADERS },
      name: 'revenue mix API'
    },
    shareholdings: {
      url: urls.shareholdingsApi,
      headers: { ...API_HEADERS },
      name: 'shareholdings API'
    }
  };
}

// Default URLs and API endpoints (for backward compatibility)
const URLS = getUrls();
const API_ENDPOINTS = getApiEndpoints();

module.exports = {
  STOCK_CONFIG,
  COMMON_HEADERS,
  STOCK_PAGE_HEADERS,
  API_HEADERS,
  PRICE_API_HEADERS,
  COOKIES,
  USER_AGENTS,
  REFERERS,
  getUrls,
  getApiEndpoints,
  URLS,
  API_ENDPOINTS
}; 