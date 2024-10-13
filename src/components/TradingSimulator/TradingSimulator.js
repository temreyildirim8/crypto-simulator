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

  const { data: orderBook } = useQuery({
    queryKey: ['orderBook', selectedPair],
    queryFn: () => fetchOrderBook(selectedPair),
    refetchInterval: 5000,
  });

  return (
    <div className="trading-simulator">
      <h1 className="title">Trading Simulator</h1>
      <div className="controls">
        <PairSelector selectedPair={selectedPair} onSelect={setSelectedPair} />
        <Wallet balance={balance} />
      </div>
      <div className="main-content">
        <div className="chart-container">
          <TradingViewChart symbol={selectedPair} />
        </div>
        <div className="order-book-container">
          {orderBook && (
            <OrderBook bids={orderBook.bids} asks={orderBook.asks} />
          )}
        </div>
        <div className="order-form-container">
          <OrderForm
            onSubmit={handleOrderSubmit}
            balance={balance}
            pair={selectedPair}
            lastPrice={tickerUpdate ? parseFloat(tickerUpdate.c) : null}
            isDisabled={balance <= 0}
          />
        </div>
        <div className="order-history-container">
          <OrderHistory orders={orders} onCancel={handleOrderCancel} />
        </div>
      </div>
    </div>
  );
}

export default TradingSimulator;