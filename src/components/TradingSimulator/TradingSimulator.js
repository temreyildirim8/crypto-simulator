import React from 'react';
import { useQuery } from '@tanstack/react-query';
import TradingViewChart from '../TradingViewChart';
import OrderBook from '../OrderBook';
import OrderForm from '../OrderForm/OrderForm';
import OrderHistory from '../OrderHistory/OrderHistory';
import PairSelector from '../PairSelector/PairSelector';
import Wallet from '../Wallet/Wallet';
import { fetchOrderBook } from '../../services/api';
import { useTradingContext } from '../../contexts/TradingContext';
import './TradingSimulator.css';

function Skeleton({ height, width = '100%' }) {
  return (
    <div
      className="skeleton"
      style={{
        height,
        width,
        backgroundColor: '#e0e0e0',
        borderRadius: '4px',
        animation: 'pulse 1.5s infinite',
      }}
    ></div>
  );
}

function TradingSimulator() {
  const {
    selectedPair,
    setSelectedPair,
    orders,
    balance,
    handleOrderSubmit,
    handleOrderCancel,
    tickerUpdate,
  } = useTradingContext();

  const { data: orderBook, isLoading: isOrderBookLoading } = useQuery({
    queryKey: ['orderBook', selectedPair],
    queryFn: () => fetchOrderBook(selectedPair),
    refetchInterval: 5000,
  });

  return (
    <div className="trading-simulator">
      <h1 className="title">Trading Simulator</h1>
      <div className="controls">
        <PairSelector selectedPair={selectedPair} onSelect={setSelectedPair} />
        {balance !== undefined ? (
          <Wallet balance={balance} />
        ) : (
          <Skeleton height="50px" />
        )}
      </div>
      <div className="main-content">
        <div className="chart-container">
          {selectedPair ? (
            <TradingViewChart symbol={selectedPair} />
          ) : (
            <Skeleton height="300px" />
          )}
        </div>
        <div className="order-book-container">
          {orderBook && !isOrderBookLoading ? (
            <OrderBook bids={orderBook.bids} asks={orderBook.asks} />
          ) : (
            <Skeleton height="300px" />
          )}
        </div>
        <div className="order-form-container">
          {balance !== undefined && selectedPair && tickerUpdate ? (
            <OrderForm
              onSubmit={handleOrderSubmit}
              balance={balance}
              pair={selectedPair}
              lastPrice={tickerUpdate ? parseFloat(tickerUpdate.c) : null}
              isDisabled={balance <= 0}
            />
          ) : (
            <Skeleton height="200x" />
          )}
        </div>
        <div className="order-history-container">
          {orders ? (
            <OrderHistory orders={orders} onCancel={handleOrderCancel} />
          ) : (
            <Skeleton height="200px" />
          )}
        </div>
      </div>
    </div>
  );
}

export default TradingSimulator;