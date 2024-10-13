import React, { createContext, useContext, useState, useEffect } from 'react';
import useWebSocket from '../hooks/useWebSocket';

const TradingContext = createContext();

export const useTradingContext = () => useContext(TradingContext);

export const TradingProvider = ({ children }) => {
  const [selectedPair, setSelectedPair] = useState('BTCUSDT');
  const [orders, setOrders] = useState([]);
  const [balance, setBalance] = useState(100000); // Starting balance of 100,000 USDT

  const { lastMessage: tickerUpdate } = useWebSocket(selectedPair);

  const updateBalance = (amount) => {
    setBalance((prevBalance) => prevBalance + amount);
  };

  const handleOrderSubmit = (orderData) => {
    const newOrder = {
      id: Date.now(),
      ...orderData,
      pair: selectedPair,
      orderCreationDate: new Date().toISOString(),
      orderCompleteDate: null,
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

  useEffect(() => {
    const checkPendingOrders = () => {
      const currentPrice = parseFloat(tickerUpdate?.c);
      if (!currentPrice) return;

      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.status === 'Pending') {
            if (
              (order.orderType === 'BUY_LIMIT' && currentPrice <= order.price) ||
              (order.orderType === 'SELL_LIMIT' && currentPrice >= order.price)
            ) {
              const updatedOrder = {
                ...order,
                status: 'Filled',
                orderCompleteDate: new Date().toISOString(),
              };
              if (order.orderType === 'SELL_LIMIT') {
                updateBalance(order.price * order.quantity);
              }
              return updatedOrder;
            }
          }
          return order;
        })
      );
    };

    const intervalId = setInterval(checkPendingOrders, 1000);
    return () => clearInterval(intervalId);
  }, [tickerUpdate]);

  return (
    <TradingContext.Provider
      value={{
        selectedPair,
        setSelectedPair,
        orders,
        balance,
        handleOrderSubmit,
        handleOrderCancel,
        tickerUpdate,
        updateBalance
      }}
    >
      {children}
    </TradingContext.Provider>
  );
};