import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import useWebSocket from '../hooks/useWebSocket';
import { toast } from 'react-toastify';
import Big from 'big.js';

const TradingContext = createContext();

export const useTradingContext = () => useContext(TradingContext);

export const TradingProvider = ({ children }) => {
  const [selectedPair, setSelectedPair] = useState('BTCUSDT');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1m');
  const [orders, setOrders] = useState([]);
  const [balance, setBalance] = useState(100000);
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [tradeHistory, setTradeHistory] = useState([]);

  const { lastMessage: tickerUpdate } = useWebSocket(selectedPair);
  const { lastMessage: tradeUpdate } = useWebSocket(`${selectedPair.toLowerCase()}@trade`);

  const aggregateOrderBook = useCallback((timeframe) => {
    const now = Date.now();
    let timeframeMs;
    switch (timeframe) {
      case '1m': timeframeMs = 60 * 1000; break;
      case '5m': timeframeMs = 5 * 60 * 1000; break;
      case '15m': timeframeMs = 15 * 60 * 1000; break;
      case '1h': timeframeMs = 60 * 60 * 1000; break;
      case '12h': timeframeMs = 12 * 60 * 60 * 1000; break;
      default: timeframeMs = 60 * 1000;
    }

    const relevantTrades = tradeHistory.filter(trade => (now - trade.timestamp) <= timeframeMs);

    const bids = {};
    const asks = {};

    relevantTrades.forEach(trade => {
      const price = new Big(trade.price);
      const amount = new Big(trade.amount);
      
      if (trade.isBuyerMaker) {
        if (!bids[price.toString()]) {
          bids[price.toString()] = new Big(0);
        }
        bids[price.toString()] = bids[price.toString()].plus(amount);
      } else {
        if (!asks[price.toString()]) {
          asks[price.toString()] = new Big(0);
        }
        asks[price.toString()] = asks[price.toString()].plus(amount);
      }
    });

    const aggregatedBids = Object.entries(bids)
      .map(([price, amount]) => ({ price, amount: amount.toString() }))
      .sort((a, b) => new Big(b.price).minus(new Big(a.price)).toNumber());

    const aggregatedAsks = Object.entries(asks)
      .map(([price, amount]) => ({ price, amount: amount.toString() }))
      .sort((a, b) => new Big(a.price).minus(new Big(b.price)).toNumber());

    setOrderBook({ bids: aggregatedBids, asks: aggregatedAsks });
  }, [tradeHistory]);

  useEffect(() => {
    if (tradeUpdate) {
      const newTrade = {
        timestamp: tradeUpdate.T,
        price: tradeUpdate.p,
        amount: tradeUpdate.q,
        isBuyerMaker: tradeUpdate.m
      };
      setTradeHistory(prev => [...prev, newTrade]);
    }
  }, [tradeUpdate]);

  useEffect(() => {
    aggregateOrderBook(selectedTimeframe);
    const intervalId = setInterval(() => aggregateOrderBook(selectedTimeframe), 1000);
    return () => clearInterval(intervalId);
  }, [selectedTimeframe, aggregateOrderBook]);

  const handleOrderSubmit = (orderData) => {
    const newOrder = {
      id: Date.now(),
      ...orderData,
      pair: selectedPair,
      orderCreationDate: new Date().toISOString(),
      orderCompleteDate: new Date().toISOString(),
      status: orderData.orderType.includes('MARKET') ? 'Filled' : 'Pending',
    };

    setOrders((prevOrders) => [...prevOrders, newOrder]);

    if (newOrder.status === 'Filled') {
      updateBalance(-newOrder.price * newOrder.quantity);
    } else if (newOrder.orderType === 'BUY_LIMIT') {
      updateBalance(-newOrder.price * newOrder.quantity);
    }
  };

  const handleOrderCancel = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId && order.status === 'Pending') {
          if (order.orderType === 'BUY_LIMIT') {
            updateBalance(order.price * order.quantity);
          }
          return { ...order, status: 'Canceled' };
        }
        return order;
      })
    );
  };

  const updateBalance = (amount) => {
    setBalance(prevBalance => prevBalance + amount);
  };

  return (
    <TradingContext.Provider
      value={{
        selectedPair,
        setSelectedPair,
        selectedTimeframe,
        setSelectedTimeframe,
        orders,
        balance,
        handleOrderSubmit,
        handleOrderCancel,
        tickerUpdate,
        updateBalance,
        orderBook
      }}
    >
      {children}
    </TradingContext.Provider>
  );
};

export default TradingContext;