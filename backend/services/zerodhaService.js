const axios = require('axios');
const cheerio = require('cheerio');
const { getUrls, getApiEndpoints, COOKIES, USER_AGENTS, REFERERS } = require('../utils/config');

/**
 * Anti-Rate-Limiting Strategies
 * Using USER_AGENTS and REFERERS imported from config.js
 */

/**
 * Zerodha HTTP Client Service
 * Handles all HTTP requests to Zerodha APIs with anti-rate-limiting
 */
class ZerodhaService {
  constructor() {
    this.session = axios.create({
      timeout: 30000,
      httpsAgent: new (require('https').Agent)({
        rejectUnauthorized: false
      })
    });
    
    this.requestCount = 0;
    this.lastRequestTime = 0;
    this.currentUserAgent = 0;
    this.currentReferer = 0;
    this.sessionId = this.generateSessionId();
    this.deviceId = this.generateDeviceId();
  }

  /**
   * Get random delay between requests
   * @returns {number} Delay in milliseconds
   */
  getRandomDelay() {
    // No delay - removed for faster performance
    return 0;
  }

  /**
   * Generate a random session ID
   * @returns {string} Session ID
   */
  generateSessionId() {
    return 'session_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  /**
   * Generate a random device ID
   * @returns {string} Device ID
   */
  generateDeviceId() {
    return 'device_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  /**
   * Get next user agent
   * @returns {string} User agent string
   */
  getNextUserAgent() {
    const userAgent = USER_AGENTS[this.currentUserAgent % USER_AGENTS.length];
    this.currentUserAgent++;
    return userAgent;
  }

  /**
   * Get next referer
   * @returns {string} Referer URL
   */
  getNextReferer() {
    const referer = REFERERS[this.currentReferer % REFERERS.length];
    this.currentReferer++;
    return referer;
  }

  /**
   * Add delay between requests to avoid rate limiting
   */
  async addDelay() {
    // No delay - removed for faster performance
    this.lastRequestTime = Date.now();
  }

  /**
   * Check if response is a Cloudflare challenge
   * @param {any} data - Response data
   * @returns {boolean} True if it's a challenge page
   */
  isCloudflareChallenge(data) {
    // Ensure data is a string before calling includes
    if (typeof data !== 'string') {
      return false;
    }
    
    return data.includes('Just a moment...') || 
           data.includes('Enable JavaScript and cookies to continue') ||
           data.includes('Checking your browser') ||
           data.includes('cf-browser-verification');
  }

  /**
   * Generate realistic browser fingerprint
   * @param {string} userAgent - User agent string
   * @returns {Object} Browser fingerprint
   */
  generateBrowserFingerprint(userAgent) {
    const isChrome = userAgent.includes('Chrome');
    const isFirefox = userAgent.includes('Firefox');
    const isSafari = userAgent.includes('Safari') && !userAgent.includes('Chrome');
    const isEdge = userAgent.includes('Edge');
    
    const fingerprint = {
      screen: {
        width: Math.floor(Math.random() * 800) + 1200, // 1200-2000
        height: Math.floor(Math.random() * 600) + 800,  // 800-1400
        colorDepth: 24,
        pixelDepth: 24
      },
      timezone: 'Asia/Kolkata',
      language: 'en-US',
      platform: isChrome || isEdge ? 'Win32' : isSafari ? 'MacIntel' : 'Linux x86_64',
      cookieEnabled: true,
      doNotTrack: '1',
      hardwareConcurrency: Math.floor(Math.random() * 8) + 4, // 4-12 cores
      maxTouchPoints: 0,
      vendor: isChrome ? 'Google Inc.' : isFirefox ? '' : isSafari ? 'Apple Computer, Inc.' : 'Microsoft Corporation'
    };
    
    return fingerprint;
  }

  /**
   * Rotate session to avoid detection
   */
  rotateSession() {
    this.sessionId = this.generateSessionId();
    this.deviceId = this.generateDeviceId();
    console.log(`🔄 Rotating session: ${this.sessionId.substring(0, 10)}...`);
  }

  /**
   * Make HTTP request with anti-rate-limiting strategies
   * @param {string} url - Target URL
   * @param {Object} headers - Request headers
   * @param {string} name - Endpoint name for logging
   * @returns {Promise<Object>} Response data
   */
  async makeRequest(url, headers, name) {
    try {
      // Add delay between requests
      await this.addDelay();
      
      console.log(`📡 Making request to ${name}: ${url}`);
      
      // Rotate user agent and referer
      const userAgent = this.getNextUserAgent();
      const referer = this.getNextReferer();
      
      // Add random query parameters to avoid caching
      const timestamp = Date.now();
      const randomParam = Math.random().toString(36).substring(7);
      
      // Generate dynamic cookies for each request
      const dynamicCookies = {
        'sessionid': this.sessionId,
        'device_id': this.deviceId,
        'csrftoken': Math.random().toString(36).substring(2, 15),
        'timestamp': timestamp.toString()
      };
      
      // Create more realistic headers based on user agent
      const isChrome = userAgent.includes('Chrome');
      const isFirefox = userAgent.includes('Firefox');
      const isSafari = userAgent.includes('Safari') && !userAgent.includes('Chrome');
      const isEdge = userAgent.includes('Edge');
      
      let secChUa = '';
      let secChUaPlatform = '';
      let secChUaMobile = '';
      
      if (isChrome) {
        secChUa = '"Not)A;Brand";v="8", "Chromium";v="121", "Google Chrome";v="121"';
        secChUaPlatform = '"Windows"';
        secChUaMobile = '?0';
      } else if (isFirefox) {
        secChUa = '"Not_A Brand";v="8", "Firefox";v="122"';
        secChUaPlatform = '"Windows"';
        secChUaMobile = '?0';
      } else if (isSafari) {
        secChUa = '"Not_A Brand";v="8", "Safari";v="17"';
        secChUaPlatform = '"macOS"';
        secChUaMobile = '?0';
      } else if (isEdge) {
        secChUa = '"Not)A;Brand";v="8", "Chromium";v="121", "Microsoft Edge";v="121"';
        secChUaPlatform = '"Windows"';
        secChUaMobile = '?0';
      }
      
      // Generate browser fingerprint
      const fingerprint = this.generateBrowserFingerprint(userAgent);
      
      const response = await this.session.get(url, {
        headers: {
          ...headers,
          'User-Agent': userAgent,
          'Referer': referer,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'Accept-Language': 'en-US,en;q=0.9,en-GB;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'cross-site',
          'Sec-Fetch-User': '?1',
          'Cache-Control': 'max-age=0',
          'Pragma': 'no-cache',
          'Sec-Ch-Ua': secChUa,
          'Sec-Ch-Ua-Mobile': secChUaMobile,
          'Sec-Ch-Ua-Platform': secChUaPlatform,
          'Cookie': Object.entries(dynamicCookies).map(([k, v]) => `${k}=${v}`).join('; ')
        },
        params: {
          _: timestamp,
          v: randomParam,
          t: Math.random().toString(36).substring(7),
          cache: Math.random().toString(36).substring(7)
        },
          maxRedirects: 5,
          validateStatus: function (status) {
            return status >= 200 && status < 500; // Accept 2xx, 3xx, 4xx but not 5xx
          }
        });

      this.requestCount++;
      console.log(`✅ ${name} request successful (${response.status}) - Request #${this.requestCount}`);
      
      // Check if response is a Cloudflare challenge
      if (this.isCloudflareChallenge(response.data)) {
        console.log(`⚠️ Cloudflare challenge detected for ${name}`);
        
        // Rotate session when challenge is detected
        this.rotateSession();
        
        return {
          success: false,
          statusCode: response.status,
          contentType: response.headers['content-type'],
          data: response.data,
          url: url,
          name: name,
          userAgent: userAgent,
          referer: referer,
          error: 'Cloudflare challenge detected'
        };
      }
      
      return {
        success: true,
        statusCode: response.status,
        contentType: response.headers['content-type'],
        data: response.data,
        url: url,
        name: name,
        userAgent: userAgent,
        referer: referer
      };
    } catch (error) {
      console.error(`❌ ${name} request failed:`, error.message);
      
      // If we get a 429, retry immediately without delay
      if (error.response?.status === 429) {
        console.log(`🔄 Rate limited, retrying immediately...`);
        
        try {
          console.log(`🔄 Retrying ${name} request...`);
          
          // Rotate session for retry
          this.rotateSession();
          
          // Generate new session for retry
          const newSessionId = this.sessionId;
          const newDeviceId = this.deviceId;
          
          const retryUserAgent = this.getNextUserAgent();
          const retryReferer = this.getNextReferer();
          
          // Create dynamic cookies for retry
          const retryCookies = {
            'sessionid': newSessionId,
            'device_id': newDeviceId,
            'csrftoken': Math.random().toString(36).substring(2, 15),
            'timestamp': Date.now().toString()
          };
          
          // Create realistic headers for retry
          const isChrome = retryUserAgent.includes('Chrome');
          const isFirefox = retryUserAgent.includes('Firefox');
          const isSafari = retryUserAgent.includes('Safari') && !retryUserAgent.includes('Chrome');
          
          let retrySecChUa = '';
          if (isChrome) {
            retrySecChUa = '"Not)A;Brand";v="8", "Chromium";v="121", "Google Chrome";v="121"';
          } else if (isFirefox) {
            retrySecChUa = '"Not_A Brand";v="8", "Firefox";v="122"';
          } else if (isSafari) {
            retrySecChUa = '"Not_A Brand";v="8", "Safari";v="17"';
          }
          
          const retryResponse = await this.session.get(url, {
            headers: {
              ...headers,
              'User-Agent': retryUserAgent,
              'Referer': retryReferer,
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
              'Accept-Language': 'en-US,en;q=0.9,en-GB;q=0.8',
              'Accept-Encoding': 'gzip, deflate, br',
              'DNT': '1',
              'Connection': 'keep-alive',
              'Upgrade-Insecure-Requests': '1',
              'Sec-Fetch-Dest': 'document',
              'Sec-Fetch-Mode': 'navigate',
              'Sec-Fetch-Site': 'cross-site',
              'Sec-Fetch-User': '?1',
              'Cache-Control': 'max-age=0',
              'Pragma': 'no-cache',
              'Sec-Ch-Ua': retrySecChUa,
              'Sec-Ch-Ua-Mobile': '?0',
              'Sec-Ch-Ua-Platform': '"Windows"',
              'Cookie': Object.entries(retryCookies).map(([k, v]) => `${k}=${v}`).join('; ')
            },
            params: {
              _: Date.now(),
              v: Math.random().toString(36).substring(7),
              t: Math.random().toString(36).substring(7),
              retry: '1',
              cache: Math.random().toString(36).substring(7)
            },
            maxRedirects: 5,
            validateStatus: function (status) {
              return status >= 200 && status < 500;
            }
          });
          
          console.log(`✅ ${name} retry successful (${retryResponse.status})`);
          
          return {
            success: true,
            statusCode: retryResponse.status,
            contentType: retryResponse.headers['content-type'],
            data: retryResponse.data,
            url: url,
            name: name,
            retried: true
          };
        } catch (retryError) {
          console.error(`❌ ${name} retry also failed:`, retryError.message);
        }
      }
      
      return {
        success: false,
        error: {
          code: 'API_REQUEST_FAILED',
          message: `Failed to fetch data from ${name}`,
          details: error.message,
          statusCode: error.response?.status,
          url: url
        }
      };
    }
  }

  /**
   * Fetch stock page data (HTML content)
   * @param {string} symbol - Stock symbol
   * @param {string} exchange - Exchange
   * @returns {Promise<Object>} Stock page data
   */
  async fetchStockPage(symbol, exchange) {
    const urls = getUrls(symbol, exchange);
    const { STOCK_PAGE_HEADERS } = require('../utils/config');
    
    const response = await this.makeRequest(
      urls.stockPage,
      STOCK_PAGE_HEADERS,
      'stock page'
    );

    if (response.success) {
      // Extract clean text from HTML
      const $ = cheerio.load(response.data);
      
      // Remove script and style elements
      $('script').remove();
      $('style').remove();
      
      // Extract text content
      const textContent = $.text()
        .replace(/\s+/g, ' ')
        .trim();

      return {
        ...response,
        data: textContent,
        symbol: symbol,
        exchange: exchange
      };
    }

    return response;
  }

  /**
   * Fetch all API data for a stock
   * @param {string} symbol - Stock symbol
   * @param {string} exchange - Exchange
   * @returns {Promise<Array>} Array of API responses
   */
  async fetchAllApiData(symbol, exchange) {
    const endpoints = getApiEndpoints(symbol, exchange);
    const successful = [];
    const failed = [];
    
    console.log(`🚀 Fetching data for ${symbol} (${exchange}) from ${Object.keys(endpoints).length} endpoints...`);
    
    // Execute requests sequentially to avoid rate limiting
    for (const [key, endpoint] of Object.entries(endpoints)) {
      try {
        console.log(`📡 Processing ${endpoint.name}...`);
        
        const result = await this.makeRequest(endpoint.url, endpoint.headers, endpoint.name);
        
        if (result.success) {
          successful.push({ 
            ...result, 
            endpointKey: key,
            symbol: symbol,
            exchange: exchange
          });
          console.log(`✅ ${endpoint.name} successful`);
        } else {
          failed.push({ 
            ...result, 
            endpointKey: key,
            symbol: symbol,
            exchange: exchange
          });
          console.log(`❌ ${endpoint.name} failed`);
        }
        
        // No extra delay - removed for faster performance
        
      } catch (error) {
        console.error(`❌ Error processing ${endpoint.name}:`, error.message);
        failed.push({
          success: false,
          error: {
            code: 'ENDPOINT_ERROR',
            message: `Failed to process ${endpoint.name}`,
            details: error.message
          },
          endpointKey: key,
          symbol: symbol,
          exchange: exchange
        });
      }
    }

    console.log(`✅ ${successful.length} successful, ❌ ${failed.length} failed`);

    return {
      successful,
      failed,
      symbol,
      exchange,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Fetch complete stock data (stock page + all APIs)
   * @param {string} symbol - Stock symbol
   * @param {string} exchange - Exchange
   * @returns {Promise<Object>} Complete stock data
   */
  async fetchCompleteStockData(symbol, exchange) {
    console.log(`📊 Fetching complete data for ${symbol} (${exchange})`);
    
    try {
      // Fetch stock page and API data in parallel
      const [stockPageResult, apiResults] = await Promise.allSettled([
        this.fetchStockPage(symbol, exchange),
        this.fetchAllApiData(symbol, exchange)
      ]);

      const result = {
        success: true,
        symbol: symbol,
        exchange: exchange,
        timestamp: new Date().toISOString(),
        stockPage: stockPageResult.status === 'fulfilled' ? stockPageResult.value : null,
        apiData: apiResults.status === 'fulfilled' ? apiResults.value : null
      };

      // Check if we have any successful data
      const hasStockPage = stockPageResult.status === 'fulfilled' && stockPageResult.value.success;
      const hasApiData = apiResults.status === 'fulfilled' && apiResults.value.successful.length > 0;

      if (!hasStockPage && !hasApiData) {
        result.success = false;
        result.error = {
          code: 'NO_DATA_AVAILABLE',
          message: 'No data could be fetched for this stock',
          details: 'Both stock page and API requests failed'
        };
      }

      return result;
    } catch (error) {
      console.error('❌ Error fetching complete stock data:', error);
      
      return {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Error fetching stock data',
          details: error.message
        }
      };
    }
  }

  /**
   * Format API data for frontend consumption
   * @param {Object} apiResults - Raw API results
   * @returns {Object} Formatted data
   */
  formatApiData(apiResults) {
    const formatted = {};

    if (apiResults && apiResults.successful && Array.isArray(apiResults.successful)) {
      apiResults.successful.forEach(response => {
        const key = response.endpointKey;
        formatted[key] = {
          data: response.data,
          statusCode: response.statusCode,
          contentType: response.contentType,
          url: response.url
        };
      });
    }

    return formatted;
  }
}

module.exports = ZerodhaService; 