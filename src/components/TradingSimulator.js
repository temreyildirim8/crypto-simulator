import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import TradingChart from './TradingChart';
import OrderBook from './OrderBook';
import OrderForm from './OrderForm';
import OrderHistory from './OrderHistory';
import PairSelector from './PairSelector';
import TimeframeSelector from './TimeframeSelector';
import BalanceDisplay from './BalanceDisplay';
import useWebSocket from '../hooks/useWebSocket';
import { fetchMarketData, fetchOrderBook, createOrder, cancelOrder } from '../services/api';

function TradingSimulator() {
  const [selectedPair, setSelectedPair] = useState('BTCUSDT');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');
  const [balance, setBalance] = useState(10000);
  const [orders, setOrders] = useState([]);

  const queryClient = useQueryClient();

  const { data: marketData } = useQuery({
    queryKey: ['marketData', selectedPair, selectedTimeframe],
    queryFn: () => fetchMarketData(selectedPair, selectedTimeframe),
    refetchInterval: 60000
  });

  const { data: orderBook } = useQuery({
    queryKey: ['orderBook', selectedPair],
    queryFn: () => fetchOrderBook(selectedPair),
    refetchInterval: 5000
  });

  const { lastMessage: tickerUpdate } = useWebSocket(selectedPair);

  useEffect(() => {
    if (tickerUpdate) {
      queryClient.setQueryData(['marketData', selectedPair, selectedTimeframe], (oldData) => {
        if (oldData && oldData.length > 0) {
          const updatedLastCandle = { ...oldData[oldData.length - 1], close: parseFloat(tickerUpdate.c) };
          return [...oldData.slice(0, -1), updatedLastCandle];
        }
        return oldData;
      });
    }
  }, [tickerUpdate, selectedPair, selectedTimeframe, queryClient]);

  const handleOrderSubmit = async (orderData) => {
    try {
      const newOrder = await createOrder({ ...orderData, pair: selectedPair });
      setOrders([...orders, newOrder]);
      if (orderData.orderType.includes('BUY')) {
        setBalance(balance - orderData.price * orderData.quantity);
      } else {
        setBalance(balance + orderData.price * orderData.quantity);
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handleOrderCancel = async (orderId) => {
    try {
      await cancelOrder(orderId);
      setOrders(orders?.map(order => 
        order.id === orderId ? { ...order, status: 'Canceled' } : order
      ));
    } catch (error) {
      console.error('Error canceling order:', error);
    }
  };

  return (
    <div>
      <h1>EXZi Trading Simulator (Binance Data)</h1>
      <PairSelector selectedPair={selectedPair} onSelect={setSelectedPair} />
      <TimeframeSelector selectedTimeframe={selectedTimeframe} onSelect={setSelectedTimeframe} />
      <BalanceDisplay balance={balance} lastPrice={tickerUpdate ? parseFloat(tickerUpdate.c) : null} />
      {/* {marketData && <TradingChart data={marketData} options={{}} />} */}
      {orderBook && <OrderBook bids={orderBook.bids} asks={orderBook.asks} />}
      <OrderForm onSubmit={handleOrderSubmit} balance={balance} pair={selectedPair} />
      <OrderHistory orders={orders} onCancel={handleOrderCancel} />
    </div>
  );
}

export default TradingSimulator;