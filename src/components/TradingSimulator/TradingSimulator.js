import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import TradingViewChart from "../TradingViewChart";
import OrderBook from "../OrderBook";
import OrderForm from "../OrderForm/OrderForm";
import OrderHistory from "../OrderHistory/OrderHistory";
import PairSelector from "../PairSelector";
import TimeframeSelector from "../TimeframeSelector";
import BalanceDisplay from "../BalanceDisplay";
import useWebSocket from "../../hooks/useWebSocket";
import {
  fetchMarketData,
  fetchOrderBook,
  createOrder,
  cancelOrder,
} from "../../services/api";
import "./TradingSimulator.css";

function TradingSimulator() {
  const [selectedPair, setSelectedPair] = useState("BTCUSDT");
  const [selectedTimeframe, setSelectedTimeframe] = useState("1h");
  const [balance, setBalance] = useState(10000);
  const [orders, setOrders] = useState([]);

  const queryClient = useQueryClient();

  const { data: marketData } = useQuery({
    queryKey: ["marketData", selectedPair, selectedTimeframe],
    queryFn: () => fetchMarketData(selectedPair, selectedTimeframe),
    refetchInterval: 60000,
  });

  const { data: orderBook } = useQuery({
    queryKey: ["orderBook", selectedPair],
    queryFn: () => fetchOrderBook(selectedPair),
    refetchInterval: 5000,
  });

  const { lastMessage: tickerUpdate } = useWebSocket(selectedPair);

  useEffect(() => {
    if (tickerUpdate) {
      queryClient.setQueryData(
        ["marketData", selectedPair, selectedTimeframe],
        (oldData) => {
          if (oldData && oldData.length > 0) {
            const updatedLastCandle = {
              ...oldData[oldData.length - 1],
              close: parseFloat(tickerUpdate.c),
            };
            return [...oldData.slice(0, -1), updatedLastCandle];
          }
          return oldData;
        }
      );
    }
  }, [tickerUpdate, selectedPair, selectedTimeframe, queryClient]);

  const handleOrderSubmit = async (orderData) => {
    if (balance <= 0) return; // Prevent order submission if balance is 0 or negative
  
    try {
      const newOrder = await createOrder({ ...orderData, pair: selectedPair });
      setOrders((prevOrders) => [...prevOrders, newOrder]);
      if (orderData.orderType.includes("BUY")) {
        setBalance(
          (prevBalance) => prevBalance - orderData.price * orderData.quantity
        );
      } else {
        setBalance(
          (prevBalance) => prevBalance + orderData.price * orderData.quantity
        );
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const handleOrderCancel = async (orderId) => {
    try {
      await cancelOrder(orderId);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "Canceled" } : order
        )
      );
      // Refund balance for canceled buy orders
      const canceledOrder = orders.find((order) => order.id === orderId);
      if (canceledOrder && canceledOrder.orderType.includes("BUY")) {
        setBalance(
          (prevBalance) =>
            prevBalance + canceledOrder.price * canceledOrder.quantity
        );
      }
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  return (
    <div className="trading-simulator">
      <h1 className="title">EXZi Trading Simulator (Binance Data)</h1>
      <div className="controls">
        <PairSelector selectedPair={selectedPair} onSelect={setSelectedPair} />
        <BalanceDisplay
          balance={balance}
        />
      </div>
      <div className="main-content">
        <div className="chart-container">
          {marketData && marketData?.length > 0 ? (
            <TradingViewChart symbol={selectedPair} />
          ) : (
            <p>Loading chart data...</p>
          )}
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
