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
    return '# Comprehensive Stock Analysis Prompt for {stock_symbol}\n\n' +
'## Context\n' +
'You are a **senior financial analyst** with over 15 years of experience in equity research. Your task is to conduct a thorough, data-driven analysis of **{stock_symbol}** and produce a comprehensive investment report.\n\n' +
'## Your Task\n' +
'Analyze the provided STOCK PAGE DATA and API DATA for **{stock_symbol}**. You must follow the **Data Mapping Guide** below to locate and interpret the specific information needed for each section of your analysis. Use your search capabilities only to supplement this data with the latest market context or to verify critical figures if necessary. The provided data should be treated as the primary source of truth.\n\n' +
'## Data Mapping Guide\n\n' +
'**Important:** The FINANCIALS DATA and SHAREHOLDINGS DATA within the API DATA block are provided as JSON strings. You must parse them into JSON objects before accessing their nested values.\n\n' +
'### 1. For Business & Industry Analysis:\n' +
'* **Company Description & Business Model:** Use the main text description at the top of the **STOCK PAGE DATA**.\n' +
'* **Industry Position & Peer Comparison:** Extract quantitative data from the **PEERS DATA** block in the API data. Use metrics like Market Cap (mcap), PE (pe), ROCE (roce), and Debt-to-Equity (de) for comparison.\n' +
'* **Growth Drivers & Recent Developments:** Synthesize information from the "Recent events" and "News" articles listed in the **STOCK PAGE DATA**.\n\n' +
'### 2. For Financial Health Assessment:\n' +
'* **Key Snapshot Metrics (PE, P/B, Div.Yield, ROE, ROCE, EPS):** Extract these directly from the metrics table at the top of the **STOCK PAGE DATA**.\n' +
'* **Yearly Financial Trends (Revenue, Net Profit):** In **API DATA**, navigate to **FINANCIALS DATA** -> Summary. For a detailed P&L, use **FINANCIALS DATA** -> Profit & Loss -> yearly and TTM.\n' +
'* **Balance Sheet Strength (Assets, Liabilities):** In **API DATA**, navigate to **FINANCIALS DATA** -> Balance Sheet.\n' +
'* **Cash Flow Analysis (Operating, Investing, Financing):** In **API DATA**, navigate to **FINANCIALS DATA** -> Cash Flow.\n' +
'* **Revenue Mix (Product & Location):** In **API DATA**, use the **REVENUEMIX DATA** block.\n\n' +
'### 3. For Valuation Analysis:\n' +
'* **Current PE & Sector PE:** Extract from the metrics table in the **STOCK PAGE DATA**.\n' +
'* **Price to Book (P/B):** Extract from the metrics table in the **STOCK PAGE DATA**.\n' +
'* **52-week Range (High/Low):** Find this in both the **STOCK PAGE DATA** and the **PRICE DATA** block of the API data.\n' +
'* **Historical Returns (1M, 1YR, 5Y):** In **API DATA**, use the **PRICE DATA** -> returns object.\n\n' +
'### 4. For Risk Assessment & Shareholding:\n' +
'* **Sector, Company-Specific, and Market Risks:** Carefully read and analyze the collection of news articles under "Recent events" in the **STOCK PAGE DATA**. These articles provide critical context on geopolitical risks, tariffs, competition, and regulatory issues.\n' +
'* **Shareholding Pattern (Promoter, FII, DII, Retail):** In **API DATA**, parse the **SHAREHOLDINGS DATA** JSON string and analyze the trend over the available quarters.\n\n' +
'## Analysis & Reporting Framework\n\n' +
'### 1. Executive Summary (2-3 paragraphs)\n' +
'-   A concise overview of the company and its business.\n' +
'-   The core investment thesis, summarizing the key reasons to buy, hold, or sell.\n' +
'-   A summary of the risk-reward profile.\n' +
'-   Your final, bottom-line recommendation.\n\n' +
'---\n\n' +
'### 2. Detailed Analysis\n\n' +
'#### A. Business & Industry Analysis\n' +
'-   **Business Model**: How does the company make money? What are its core operations?\n' +
'-   **Competitive Advantages (Moat)**: What protects it from competitors? How does it stack up against peers based on the data?\n' +
'-   **Industry Position**: Is it a market leader? What are the industry\'s growth prospects and headwinds based on the news?\n' +
'-   **Management Quality**: Infer from corporate actions and news. Note if data is limited.\n\n' +
'#### B. Financial Health Assessment\n' +
'-   **Revenue & Profitability Trends**: Analyze the growth and consistency of revenue and net profit over the last 3-5 years.\n' +
'-   **Balance Sheet Strength**: Evaluate debt levels, assets, and liabilities.\n' +
'-   **Cash Flow Analysis**: Is the company generating positive operating cash flow consistently?\n' +
'-   **Efficiency Ratios**: Interpret ROE and ROCE to gauge capital efficiency.\n\n' +
'#### C. Valuation Analysis\n' +
'-   **Relative Valuation**: Compare the stock\'s current PE ratio against its sector and key competitors. Is it overvalued or undervalued?\n' +
'-   **Price Action**: Where is the stock trading relative to its 52-week high and low?\n' +
'-   **Fair Value Conclusion**: Based on all data, provide a qualitative conclusion on its valuation.\n\n' +
'#### D. Risk Analysis\n' +
'-   **Geopolitical/Market Risks**: What are the key risks highlighted in the news (e.g., US tariffs, reliance on Russian oil)?\n' +
'-   **Company-Specific Risks**: Are there internal risks mentioned (e.g., IPO delays for subsidiaries like Jio, segment underperformance)?\n' +
'-   **Shareholding Trends**: Is promoter holding increasing or decreasing? Are institutions (FII/DII) buying or selling?\n\n' +
'---\n\n' +
'### 3. Investment Thesis & Final Recommendation\n\n' +
'**Investment Profile:**\n' +
'-   **Risk Level**: [Low / Medium / High]\n' +
'-   **Suitable Investor**: [e.g., Growth / Value / Dividend-focused / High-risk tolerant]\n' +
'-   **Investment Horizon**: [Short-term (1-3 years) / Long-term (5+ years)]\n\n' +
'**Verdict & Strategy:**\n' +
'-   **Recommendation**: **[BUY / HOLD / SELL]**\n' +
'-   **Justification**: Provide a clear, evidence-based reason for your recommendation, linking back to the data.\n' +
'-   **Key Factors to Monitor**: List 3-4 critical metrics or news themes that investors should track.\n\n' +
'## Important Guidelines\n' +
'-   **Be Objective**: Present both the positive aspects (bull case) and negative aspects (bear case).\n' +
'-   **Be Data-Driven**: Base all claims on the provided data blocks as mapped out above.\n' +
'-   **Focus on Fundamentals**: Prioritize long-term business fundamentals over short-term market fluctuations.\n\n' +
'---\n' +
'## Data to Analyze\n' +
'*This is the primary data for your analysis. Follow the Data Mapping Guide to interpret these blocks.*\n\n' +
'### STOCK PAGE DATA:\n' +
'[PASTE STOCK PAGE DATA HERE]\n\n' +
'### API DATA:\n' +
'*Note: The values for FINANCIALS DATA and SHAREHOLDINGS DATA are JSON strings that need to be parsed.*\n' +
'[PASTE API DATA JSON HERE]\n' +
'---';
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
      // Format the data for the prompt
      const stockPageData = this.formatStockPageData(stockData.stockPage);
      const apiData = this.formatApiData(stockData.apiData);
      
      // Combine all data into a single formatted string
      const combinedData = `STOCK PAGE DATA:\n${stockPageData}\n\nAPI DATA:\n${apiData}`;
      
      // Replace placeholders in base prompt
      let prompt = this.basePrompt
        .replace(/\{stock_symbol\}/g, symbol.toUpperCase())
        .replace(/\[PASTE STOCK PAGE DATA HERE\]/g, stockPageData)
        .replace(/\[PASTE API DATA JSON HERE\]/g, apiData);

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

    return `${stockPageData.data}

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

    let formattedData = '';

    dataToProcess.forEach((response, index) => {
      formattedData += `${response.name.toUpperCase()} DATA:\n\n`;
      
      // Special handling for price data to filter historical data to last 2 years
      if (response.name === 'price' && response.data && response.data.historical_data) {
        const filteredData = this.filterHistoricalDataToLastTwoYears(response.data);
        formattedData += `${JSON.stringify(filteredData)}\n\n`;
      } else {
        // Format JSON data for other endpoints (compact format without line breaks)
        if (typeof response.data === 'object') {
          formattedData += `${JSON.stringify(response.data)}\n\n`;
        } else {
          formattedData += `${response.data}\n\n`;
        }
      }
      
      formattedData += '─'.repeat(80) + '\n\n';
    });

    return formattedData;
  }

  /**
   * Filter historical data to only include last 2 years
   * @param {Object} priceData - Price data object
   * @returns {Object} Filtered price data
   */
  filterHistoricalDataToLastTwoYears(priceData) {
    if (!priceData || !priceData.historical_data || !Array.isArray(priceData.historical_data)) {
      return priceData;
    }

    // Calculate timestamp for 2 years ago
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    const twoYearsAgoTimestamp = twoYearsAgo.getTime();

    // Filter historical data to only include data from last 2 years
    const filteredHistoricalData = priceData.historical_data.filter(point => {
      if (Array.isArray(point) && point.length >= 1) {
        const timestamp = point[0];
        return timestamp >= twoYearsAgoTimestamp;
      }
      return false;
    });

    // Return the price data with filtered historical data
    return {
      ...priceData,
      historical_data: filteredHistoricalData
    };
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