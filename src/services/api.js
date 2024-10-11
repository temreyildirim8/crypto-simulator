const API_BASE_URL = 'https://api.binance.com/api/v3';

export const fetchMarketData = async (symbol, interval) => {
  const response = await fetch(`${API_BASE_URL}/klines?symbol=${symbol.replace('/', '')}&interval=${interval}`);
  const data = await response.json();
  return data?.map(candle => ({
    time: candle[0],
    open: parseFloat(candle[1]),
    high: parseFloat(candle[2]),
    low: parseFloat(candle[3]),
    close: parseFloat(candle[4]),
    volume: parseFloat(candle[5]),
  }));
};

export const fetchOrderBook = async (symbol) => {
  const response = await fetch(`${API_BASE_URL}/depth?symbol=${symbol.replace('/', '')}&limit=10`);
  const data = await response.json();
  return {
    bids: data?.bids?.map(([price, amount]) => ({ price: parseFloat(price), amount: parseFloat(amount) })),
    asks: data?.asks?.map(([price, amount]) => ({ price: parseFloat(price), amount: parseFloat(amount) })),
  };
};

export const createOrder = async (orderData) => {
  // Note: This is a simulated order creation as Binance requires authentication for real orders
  return {
    id: Math.random().toString(36).substr(2, 9),
    ...orderData,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };
};

export const cancelOrder = async (orderId) => {
  // Note: This is a simulated order cancellation
  return { success: true, orderId };
};