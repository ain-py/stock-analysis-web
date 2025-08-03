/**
 * Investment Analysis Prompt Generator
 * Creates comprehensive analysis prompts for LLM consumption
 */
class PromptGenerator {
  constructor() {
    this.basePrompt = this.loadBasePrompt();
  }

  /**
   * Load the base prompt template
   * @returns {string} Base prompt template
   */
  loadBasePrompt() {
    return `# Investment Analysis Prompt for [STOCK_SYMBOL]

## Context
You are a senior financial analyst with 15+ years of experience in equity research and investment advisory. You are analyzing [STOCK_SYMBOL] stock data for a new graduate investor who:
- Just started a job with ₹50,000/month salary
- Has limited investment experience
- Wants to start investing in stocks
- Is looking for long-term wealth creation

## Your Task
Analyze the provided Zerodha stock data for [STOCK_SYMBOL] and provide comprehensive investment insights. The data includes:
1. Stock page information (company overview, key metrics)
2. Financial data (P&L, balance sheet, cash flow)
3. Peer comparison data
4. Price and technical data
5. Revenue mix information
6. Shareholding pattern

## Analysis Framework

### 1. Company Overview Analysis
- **Business Model**: What does the company do? Is it a good business?
- **Industry Position**: How does it compare to competitors?
- **Growth Potential**: What are the growth drivers and risks?
- **Management Quality**: Any red flags or positive indicators?

### 2. Financial Health Assessment
- **Profitability**: Is the company consistently profitable?
- **Debt Levels**: How much debt does it have? Is it manageable?
- **Cash Flow**: Does it generate good cash flow?
- **Dividend History**: Does it pay dividends? How consistent?
- **ROE/ROCE**: How efficiently does it use capital?

### 3. Valuation Analysis
- **Current PE Ratio**: Is it expensive or cheap compared to peers?
- **Price to Book**: How does it compare to book value?
- **52-week range**: Where is the current price in the range?
- **Fair Value Estimate**: What should be the fair price?

### 4. Risk Assessment
- **Sector Risks**: What are the risks in this sector?
- **Company-Specific Risks**: Any unique risks for this company?
- **Market Risks**: How does it perform in different market conditions?
- **Liquidity Risk**: Is it easy to buy/sell this stock?

### 5. Investment Suitability for New Graduate
- **Risk Level**: Is this suitable for a beginner investor?
- **Investment Horizon**: Short-term vs long-term potential
- **Portfolio Fit**: How much of the portfolio should this stock represent?
- **Entry Strategy**: When and how much to invest?

## Required Output Format

### Executive Summary (2-3 paragraphs)
- Brief company overview
- Key investment thesis
- Risk-reward assessment
- Final recommendation

### Detailed Analysis

#### 1. Business Analysis
- Company description and business model
- Industry position and competitive advantages
- Growth drivers and future prospects

#### 2. Financial Analysis
- Revenue and profit trends
- Debt and cash flow analysis
- Key financial ratios and their interpretation

#### 3. Valuation Analysis
- Current valuation metrics
- Comparison with peers
- Fair value estimation

#### 4. Risk Analysis
- Sector-specific risks
- Company-specific risks
- Market and liquidity risks

#### 5. Investment Recommendation

**For a New Graduate Investor (₹50k/month salary):**

**Risk Assessment:**
- Risk Level: [Low/Medium/High]
- Suitable for beginners: [Yes/No]
- Recommended portfolio allocation: [X%]

**Investment Strategy:**
- Recommended investment amount: [₹X]
- Investment frequency: [Monthly/Quarterly/One-time]
- Entry timing: [Immediate/Wait for correction/Not recommended]
- Investment horizon: [Short-term/Long-term]

**Final Verdict:**
- **BUY/HOLD/SELL** with clear reasoning
- Expected returns over 1-3 years
- Key factors that could change the recommendation

### Additional Guidance for New Investor
- How to start investing in this stock
- What to monitor going forward
- When to consider selling
- Alternative investment options to consider

## Important Notes
- Be conservative in your analysis given the investor's inexperience
- Emphasize long-term thinking over short-term gains
- Consider the investor's limited capital (₹50k/month)
- Provide clear, actionable advice
- Explain complex financial terms in simple language
- Include both positive and negative aspects objectively

## Data to Analyze
Please analyze the following data from the Zerodha scraper output:

[STOCK_PAGE_DATA]

[API_DATA]

---

**Remember**: This is for a new graduate with limited investment experience. Provide clear, conservative, and actionable advice that prioritizes capital preservation and steady wealth creation over aggressive returns.`;
  }

  /**
   * Generate investment analysis prompt
   * @param {string} symbol - Stock symbol
   * @param {Object} stockData - Complete stock data
   * @param {Object} options - Customization options
   * @returns {Object} Generated prompt
   */
  generatePrompt(symbol, stockData, options = {}) {
    try {
      // Replace placeholders in base prompt
      let prompt = this.basePrompt
        .replace(/\[STOCK_SYMBOL\]/g, symbol.toUpperCase())
        .replace(/\[STOCK_PAGE_DATA\]/g, this.formatStockPageData(stockData.stockPage))
        .replace(/\[API_DATA\]/g, this.formatApiData(stockData.apiData));

      // Apply customizations
      if (options.investorType) {
        prompt = this.customizeForInvestorType(prompt, options.investorType);
      }

      if (options.salary) {
        prompt = prompt.replace(/₹50,000/g, `₹${options.salary.toLocaleString()}`);
      }

      return {
        success: true,
        prompt: prompt,
        symbol: symbol,
        timestamp: new Date().toISOString(),
        options: options
      };
    } catch (error) {
      console.error('❌ Error generating prompt:', error);
      
      return {
        success: false,
        error: {
          code: 'PROMPT_GENERATION_FAILED',
          message: 'Failed to generate analysis prompt',
          details: error.message
        }
      };
    }
  }

  /**
   * Format stock page data for prompt
   * @param {Object} stockPageData - Stock page data
   * @returns {string} Formatted stock page data
   */
  formatStockPageData(stockPageData) {
    if (!stockPageData || !stockPageData.success) {
      return 'Stock page data not available';
    }

    return `STOCK PAGE DATA:
${stockPageData.data}

Source: ${stockPageData.url}
Status: ${stockPageData.statusCode}
Timestamp: ${stockPageData.timestamp || 'N/A'}`;
  }

  /**
   * Format API data for prompt
   * @param {Object} apiData - API data results
   * @returns {string} Formatted API data
   */
  formatApiData(apiData) {
    if (!apiData) {
      return 'API data not available';
    }

    // Handle both raw API response format and formatted frontend format
    let dataToProcess = [];
    
    if (apiData.successful && Array.isArray(apiData.successful)) {
      // Raw API response format
      dataToProcess = apiData.successful;
    } else if (typeof apiData === 'object') {
      // Formatted frontend format (individual properties)
      dataToProcess = Object.entries(apiData).map(([key, value]) => ({
        name: key,
        url: value.url || 'N/A',
        statusCode: value.statusCode || 200,
        contentType: value.contentType || 'application/json',
        data: value.data
      }));
    }

    if (dataToProcess.length === 0) {
      return 'API data not available';
    }

    let formattedData = 'API DATA:\n\n';

    dataToProcess.forEach((response, index) => {
      formattedData += `${response.name.toUpperCase()} DATA:\n\n`;
      
      // Format JSON data
      if (typeof response.data === 'object') {
        formattedData += `${JSON.stringify(response.data, null, 2)}\n\n`;
      } else {
        formattedData += `${response.data}\n\n`;
      }
      
      formattedData += '─'.repeat(80) + '\n\n';
    });

    return formattedData;
  }

  /**
   * Customize prompt for different investor types
   * @param {string} prompt - Base prompt
   * @param {string} investorType - Type of investor
   * @returns {string} Customized prompt
   */
  customizeForInvestorType(prompt, investorType) {
    switch (investorType.toLowerCase()) {
      case 'experienced':
        return prompt.replace(
          'new graduate investor who:',
          'experienced investor who:'
        ).replace(
          'limited investment experience',
          'significant investment experience'
        );
      
      case 'conservative':
        return prompt.replace(
          '₹50,000/month salary',
          '₹50,000/month salary (conservative approach)'
        );
      
      case 'aggressive':
        return prompt.replace(
          'conservative, and actionable advice',
          'balanced, and actionable advice'
        );
      
      default:
        return prompt;
    }
  }

  /**
   * Validate stock data before generating prompt
   * @param {Object} stockData - Stock data to validate
   * @returns {Object} Validation result
   */
  validateStockData(stockData) {
    const errors = [];

    if (!stockData) {
      errors.push('No stock data provided');
      return { valid: false, errors };
    }

    if (!stockData.symbol) {
      errors.push('Stock symbol is required');
    }

    if (!stockData.stockPage && (!stockData.apiData || stockData.apiData.successful.length === 0)) {
      errors.push('No valid data available (neither stock page nor API data)');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

module.exports = PromptGenerator; 