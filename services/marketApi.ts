// This is a mock API service to simulate fetching real-time stock data.
// In a real-world application, you would replace this with a call to a financial data API
// like Alpha Vantage, IEX Cloud, or Financial Modeling Prep.

export interface Quote {
  ticker: string;
  companyName: string;
  price: number;
  volume: number;
  dayHigh: number;
  dayLow: number;
  previousClose: number;
}

// A simple in-memory cache to make price fluctuations feel more "real"
const tickerCache: { [key: string]: { basePrice: number, companyName: string } } = {
    'AAPL': { basePrice: 172.50, companyName: 'Apple Inc.' },
    'GOOGL': { basePrice: 135.80, companyName: 'Alphabet Inc.' },
    'TSLA': { basePrice: 225.40, companyName: 'Tesla, Inc.' },
    'NVDA': { basePrice: 488.30, companyName: 'NVIDIA Corporation' },
    'AMZN': { basePrice: 130.00, companyName: 'Amazon.com, Inc.' },
    'MSFT': { basePrice: 330.00, companyName: 'Microsoft Corporation' }
};


export const fetchQuote = (ticker: string): Promise<Quote> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const upperTicker = ticker.toUpperCase();

      if (upperTicker === 'FAIL' || !tickerCache[upperTicker]) {
        return reject(new Error(`Invalid ticker symbol: ${ticker}`));
      }

      const cacheEntry = tickerCache[upperTicker];
      const basePrice = cacheEntry.basePrice;

      // Simulate price fluctuation
      const changePercent = (Math.random() - 0.495) * 0.05; // -2.5% to +2.5% change
      const newPrice = basePrice * (1 + changePercent);
      
      // Update cache for next fetch to show continuity
      tickerCache[upperTicker].basePrice = newPrice;

      const previousClose = basePrice / (1 + (Math.random() - 0.5) * 0.01); // Close to base price
      const dayHigh = Math.max(newPrice, previousClose) * (1 + Math.random() * 0.02); // Up to 2% higher
      const dayLow = Math.min(newPrice, previousClose) * (1 - Math.random() * 0.02); // Up to 2% lower
      const volume = 20_000_000 + Math.random() * 50_000_000; // Realistic volume in tens of millions

      const quote: Quote = {
        ticker: upperTicker,
        companyName: cacheEntry.companyName,
        price: parseFloat(newPrice.toFixed(2)),
        volume: Math.round(volume),
        dayHigh: parseFloat(dayHigh.toFixed(2)),
        dayLow: parseFloat(dayLow.toFixed(2)),
        previousClose: parseFloat(previousClose.toFixed(2)),
      };
      
      resolve(quote);
    }, 500 + Math.random() * 500); // Simulate network latency
  });
};
