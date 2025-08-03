# Stock Analysis Web Application

A modern web application that transforms the Python-based Zerodha stock scraper into an interactive web interface. The application allows users to input stock configuration, fetch real-time stock data from Zerodha APIs, visualize price data through interactive charts, and generate comprehensive investment analysis prompts.

## 🚀 Features

### Core Functionality
- **Stock Configuration Input**: Input stock symbol, exchange, and company name
- **Real-time Data Fetching**: Fetch data from 5 Zerodha API endpoints + stock page
- **Interactive Price Charts**: Visualize price data with Chart.js
- **Investment Analysis Prompts**: Generate comprehensive analysis prompts for AI assistants
- **Error Handling**: Comprehensive error handling with user-friendly messages

### Data Visualization
- **Tabbed Data Display**: View financials, peers, revenue mix, shareholdings, and stock page data
- **Interactive Price Charts**: Zoom, pan, and hover capabilities
- **Price Statistics**: Current price, 52-week high/low, price change analysis

### Analysis Tools
- **Customizable Prompts**: Adjust for different investor types and salary levels
- **Copy to Clipboard**: Easy prompt sharing
- **Download as Markdown**: Save prompts for later use
- **AI-Ready Format**: Optimized for ChatGPT, Claude, and other AI assistants

## 🏗️ Architecture

### Backend (Node.js + Express)
```
backend/
├── server.js                 # Main server file
├── routes/
│   ├── stock.js             # Stock data endpoints
│   └── analysis.js          # Analysis prompt endpoints
├── services/
│   ├── zerodhaService.js    # Zerodha API integration
│   └── promptGenerator.js   # Prompt generation logic
├── middleware/
│   └── validation.js        # Input validation
└── utils/
    └── config.js            # Configuration management
```

### Frontend (React + TypeScript)
```
frontend/
├── src/
│   ├── components/
│   │   ├── StockConfigForm.tsx    # Stock input form
│   │   ├── DataDisplay.tsx        # Tabbed data view
│   │   ├── PriceChart.tsx         # Interactive charts
│   │   ├── AnalysisPrompt.tsx     # Prompt generation
│   │   └── ErrorHandler.tsx       # Error display
│   ├── App.tsx                    # Main application
│   └── App.css                    # Styles
└── package.json
```

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup
```bash
cd stock-analysis-web/backend
npm install
npm run dev
```

The backend will start on `http://localhost:5001`

### Frontend Setup
```bash
cd stock-analysis-web/frontend
npm install
npm start
```

The frontend will start on `http://localhost:3000`

## 📊 API Endpoints

### Stock Data Endpoints
- `POST /api/stock/fetch` - Fetch complete stock data
- `GET /api/stock/examples` - Get example stock symbols
- `GET /api/stock/health` - Health check

### Analysis Endpoints
- `POST /api/analysis/generate` - Generate investment analysis prompt
- `GET /api/analysis/template` - Get base prompt template
- `GET /api/analysis/customization-options` - Get customization options
- `GET /api/analysis/health` - Health check

## 🎯 Usage

### 1. Stock Configuration
1. Enter a stock symbol (e.g., AIRAN, RELIANCE)
2. Select exchange (BSE or NSE)
3. Optionally enter company name
4. Click "Fetch Stock Data"

### 2. Data Visualization
- View stock data in organized tabs
- Explore interactive price charts
- Analyze price statistics and trends

### 3. Investment Analysis
1. Click "Generate Analysis" to create a prompt
2. Customize for your investor profile
3. Copy the prompt to clipboard
4. Paste into ChatGPT, Claude, or other AI assistants

## 🔧 Configuration

### Backend Configuration
The backend uses the same configuration as the original Python scraper:
- Headers and cookies for Zerodha APIs
- URL generation for different exchanges
- Rate limiting and error handling

### Frontend Configuration
- API base URL: `http://localhost:5000`
- Chart.js configuration for price visualization
- Responsive design for all screen sizes

## 🎨 UI Components

### Stock Configuration Form
- Input validation for stock symbols
- Exchange selection (BSE/NSE)
- Example stock suggestions
- Loading states and error handling

### Data Display
- Tabbed interface for different data types
- JSON formatting with syntax highlighting
- Responsive design for mobile devices

### Price Chart
- Interactive line chart with Chart.js
- Time-based x-axis with date formatting
- Price statistics and change indicators
- Hover tooltips with detailed information

### Analysis Prompt
- Customizable prompt generation
- Copy to clipboard functionality
- Download as markdown file
- Investor type and salary customization

## 🚨 Error Handling

### Backend Errors
- Input validation errors
- API request failures
- Rate limiting
- Network timeouts

### Frontend Errors
- Network connectivity issues
- API response errors
- Data formatting errors
- User-friendly error messages

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🔒 Security Features

- Input validation and sanitization
- Rate limiting to prevent abuse
- CORS configuration
- Error handling without exposing sensitive data

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
npm run build
npm start
```

### Frontend Deployment
```bash
cd frontend
npm run build
```

The built files can be served from any static file server.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Original Python scraper by the user
- Zerodha APIs for stock data
- Chart.js for interactive charts
- React and TypeScript communities

## 📞 Support

For issues and questions:
1. Check the error messages in the application
2. Review the browser console for detailed errors
3. Ensure both backend and frontend are running
4. Verify network connectivity to Zerodha APIs

---

**Note**: This application is for educational and analysis purposes. Always verify stock data from official sources before making investment decisions. 