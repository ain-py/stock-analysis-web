const express = require('express');
const router = express.Router();
const ZerodhaService = require('../services/zerodhaService');
const { validateStockConfig, rateLimit } = require('../middleware/validation');

const zerodhaService = new ZerodhaService();

/**
 * POST /api/stock/fetch
 * Fetch complete stock data for a given symbol and exchange
 */
router.post('/fetch', rateLimit, validateStockConfig, async (req, res) => {
  try {
    const { symbol, exchange, companyName } = req.body;
    
    console.log(`📊 Fetching stock data for ${symbol} (${exchange})`);
    
    // Fetch complete stock data
    const result = await zerodhaService.fetchCompleteStockData(symbol, exchange);
    
    if (result.success) {
      // Format the response for frontend
      const formattedResponse = {
        success: true,
        data: {
          symbol: result.symbol,
          exchange: result.exchange,
          timestamp: result.timestamp,
          stockPage: result.stockPage,
          apiData: zerodhaService.formatApiData(result.apiData)
        },
        summary: {
          totalEndpoints: result.apiData?.successful?.length || 0,
          failedEndpoints: result.apiData?.failed?.length || 0,
          hasStockPage: result.stockPage?.success || false
        }
      };
      
      console.log(`✅ Successfully fetched data for ${symbol}`);
      res.json(formattedResponse);
    } else {
      console.log(`❌ Failed to fetch data for ${symbol}:`, result.error);
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('❌ Error in stock fetch route:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch stock data',
        details: error.message
      }
    });
  }
});

/**
 * GET /api/stock/examples
 * Get example stock symbols for different exchanges
 */
router.get('/examples', (req, res) => {
  const examples = {
    BSE: [
      { symbol: 'RELIANCE', name: 'Reliance Industries' },
      { symbol: 'TCS', name: 'Tata Consultancy Services' },
      { symbol: 'INFY', name: 'Infosys Limited' },
      { symbol: 'HDFCBANK', name: 'HDFC Bank' },
      { symbol: 'ICICIBANK', name: 'ICICI Bank' },
      { symbol: 'DEEPAKNTR', name: 'Deepak Nitrite' },
      { symbol: 'TATAMOTORS', name: 'Tata Motors' },
      { symbol: 'WIPRO', name: 'Wipro Limited' }
    ],
    NSE: [
      { symbol: 'RELIANCE', name: 'Reliance Industries' },
      { symbol: 'TCS', name: 'Tata Consultancy Services' },
      { symbol: 'INFY', name: 'Infosys Limited' },
      { symbol: 'HDFCBANK', name: 'HDFC Bank' },
      { symbol: 'ICICIBANK', name: 'ICICI Bank' },
      { symbol: 'TATAMOTORS', name: 'Tata Motors' },
      { symbol: 'WIPRO', name: 'Wipro Limited' },
      { symbol: 'BHARTIARTL', name: 'Bharti Airtel' },
      { symbol: 'AIRAN', name: 'Airan Limited' }
    ]
  };
  
  res.json({
    success: true,
    data: examples
  });
});

/**
 * GET /api/stock/health
 * Health check for stock service
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'Stock Service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 