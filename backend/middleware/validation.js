/**
 * Validation middleware for API requests
 */

/**
 * Validate stock configuration input
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function validateStockConfig(req, res, next) {
  const { symbol, exchange, companyName } = req.body;
  const errors = [];

  // Validate symbol
  if (!symbol) {
    errors.push('Stock symbol is required');
  } else if (typeof symbol !== 'string') {
    errors.push('Stock symbol must be a string');
  } else if (!/^[A-Z0-9]+$/.test(symbol.toUpperCase())) {
    errors.push('Stock symbol must contain only letters and numbers');
  } else if (symbol.length < 2 || symbol.length > 10) {
    errors.push('Stock symbol must be between 2 and 10 characters');
  }

  // Validate exchange
  if (!exchange) {
    errors.push('Exchange is required');
  } else if (!['BSE', 'NSE'].includes(exchange.toUpperCase())) {
    errors.push('Exchange must be either BSE or NSE');
  }

  // Validate company name (optional)
  if (companyName && typeof companyName !== 'string') {
    errors.push('Company name must be a string');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: errors
      }
    });
  }

  // Normalize inputs
  req.body.symbol = symbol.toUpperCase();
  req.body.exchange = exchange.toUpperCase();
  if (companyName) {
    req.body.companyName = companyName.trim();
  }

  next();
}

/**
 * Validate analysis prompt generation input
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function validateAnalysisRequest(req, res, next) {
  const { symbol, stockData, customizations } = req.body;
  const errors = [];

  // Validate symbol
  if (!symbol) {
    errors.push('Stock symbol is required');
  } else if (typeof symbol !== 'string') {
    errors.push('Stock symbol must be a string');
  }

  // Validate stock data
  if (!stockData) {
    errors.push('Stock data is required');
  } else if (typeof stockData !== 'object') {
    errors.push('Stock data must be an object');
  }

  // Validate customizations (optional)
  if (customizations && typeof customizations !== 'object') {
    errors.push('Customizations must be an object');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: errors
      }
    });
  }

  // Normalize symbol
  req.body.symbol = symbol.toUpperCase();

  next();
}

/**
 * Rate limiting middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function rateLimit(req, res, next) {
  // Simple in-memory rate limiting
  const clientIp = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10; // 10 requests per minute

  if (!req.app.locals.rateLimit) {
    req.app.locals.rateLimit = new Map();
  }

  const clientData = req.app.locals.rateLimit.get(clientIp) || { count: 0, resetTime: now + windowMs };

  if (now > clientData.resetTime) {
    clientData.count = 1;
    clientData.resetTime = now + windowMs;
  } else {
    clientData.count++;
  }

  req.app.locals.rateLimit.set(clientIp, clientData);

  if (clientData.count > maxRequests) {
    return res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please try again later.',
        details: `Rate limit: ${maxRequests} requests per minute`
      }
    });
  }

  next();
}

/**
 * Error handling middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function errorHandler(err, req, res, next) {
  console.error('❌ Error:', err);

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: err.message
      }
    });
  }

  if (err.name === 'TimeoutError') {
    return res.status(408).json({
      success: false,
      error: {
        code: 'TIMEOUT_ERROR',
        message: 'Request timeout',
        details: 'The request took too long to complete'
      }
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An internal server error occurred',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }
  });
}

module.exports = {
  validateStockConfig,
  validateAnalysisRequest,
  rateLimit,
  errorHandler
}; 