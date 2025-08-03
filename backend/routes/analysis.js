const express = require('express');
const router = express.Router();
const PromptGenerator = require('../services/promptGenerator');
const { validateAnalysisRequest, rateLimit } = require('../middleware/validation');

const promptGenerator = new PromptGenerator();

/**
 * POST /api/analysis/generate
 * Generate investment analysis prompt for a stock
 */
router.post('/generate', rateLimit, validateAnalysisRequest, async (req, res) => {
  try {
    const { symbol, stockData, customizations } = req.body;
    
    console.log(`📝 Generating analysis prompt for ${symbol}`);
    
    // Validate stock data
    const validation = promptGenerator.validateStockData(stockData);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_STOCK_DATA',
          message: 'Invalid stock data provided',
          details: validation.errors
        }
      });
    }
    
    // Generate the prompt
    const result = promptGenerator.generatePrompt(symbol, stockData, customizations);
    
    if (result.success) {
      console.log(`✅ Successfully generated prompt for ${symbol}`);
      res.json({
        success: true,
        data: {
          prompt: result.prompt,
          symbol: result.symbol,
          timestamp: result.timestamp,
          options: result.options
        }
      });
    } else {
      console.log(`❌ Failed to generate prompt for ${symbol}:`, result.error);
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('❌ Error in analysis generation route:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GENERATION_ERROR',
        message: 'Failed to generate analysis prompt',
        details: error.message
      }
    });
  }
});

/**
 * GET /api/analysis/template
 * Get the base prompt template
 */
router.get('/template', (req, res) => {
  try {
    const template = promptGenerator.loadBasePrompt();
    
    res.json({
      success: true,
      data: {
        template: template,
        description: 'Base investment analysis prompt template',
        placeholders: [
          '[STOCK_SYMBOL]',
          '[STOCK_PAGE_DATA]',
          '[API_DATA]'
        ]
      }
    });
  } catch (error) {
    console.error('❌ Error getting template:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'TEMPLATE_ERROR',
        message: 'Failed to get prompt template',
        details: error.message
      }
    });
  }
});

/**
 * GET /api/analysis/customization-options
 * Get available customization options for prompts
 */
router.get('/customization-options', (req, res) => {
  const options = {
    investorTypes: [
      { value: 'new_graduate', label: 'New Graduate', description: 'Limited investment experience, ₹50k/month salary' },
      { value: 'experienced', label: 'Experienced Investor', description: 'Significant investment experience' },
      { value: 'conservative', label: 'Conservative', description: 'Risk-averse approach' },
      { value: 'aggressive', label: 'Aggressive', description: 'Higher risk tolerance' }
    ],
    salaryRanges: [
      { value: 30000, label: '₹30,000/month' },
      { value: 50000, label: '₹50,000/month' },
      { value: 75000, label: '₹75,000/month' },
      { value: 100000, label: '₹1,00,000/month' }
    ],
    riskLevels: [
      { value: 'low', label: 'Low Risk', description: 'Capital preservation focus' },
      { value: 'medium', label: 'Medium Risk', description: 'Balanced approach' },
      { value: 'high', label: 'High Risk', description: 'Growth focus' }
    ]
  };
  
  res.json({
    success: true,
    data: options
  });
});

/**
 * GET /api/analysis/health
 * Health check for analysis service
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'Analysis Service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 