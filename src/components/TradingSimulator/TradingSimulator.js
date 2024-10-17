import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Switch from "@mui/material/Switch";
import { useTheme } from "../../contexts/ThemeContext";
import { useTheme as useMUITheme } from "@mui/material/styles";
import TradingViewChart from "../TradingViewChart";
import OrderBook from "../OrderBook";
import OrderForm from "../OrderForm/OrderForm";
import OrderHistory from "../OrderHistory/OrderHistory";
import PairSelector from "../PairSelector/PairSelector";
import Wallet from "../Wallet/Wallet";
import { fetchOrderBook } from "../../services/api";
import { useTradingContext } from "../../contexts/TradingContext";
import "./TradingSimulator.css";

function Skeleton({ height, width = "100%" }) {
  const muiTheme = useMUITheme();
  return (
    <div
      className="skeleton"
      style={{
        height,
        width,
        backgroundColor: muiTheme.palette.skeleton,
        borderRadius: "4px",
        animation: "pulse 1.5s infinite",
      }}
    ></div>
  );
}

function TradingSimulator() {
  const { darkMode, toggleDarkMode } = useTheme();
  const muiTheme = useMUITheme();

  const {
    selectedPair,
    setSelectedPair,
    orders,
    balance,
    handleOrderSubmit,
    handleOrderCancel,
  } = useTradingContext();

  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data: orderBook, isLoading: isOrderBookLoading } = useQuery({
    queryKey: ["orderBook", selectedPair],
    queryFn: () => fetchOrderBook(selectedPair),
    refetchInterval: 5000,
  });

  const handleOrderSelect = (type, price, amount) => {
    setSelectedOrder({ type, price, amount });
  };

  return (
    <div
      className="trading-simulator"
      style={{
        backgroundColor: muiTheme.palette.background.default,
        color: muiTheme.palette.text.primary,
      }}
    >
      <div className="title">

      <div className="theme-switch">
          <Switch checked={darkMode} onChange={toggleDarkMode} />
          <span>{darkMode ? "Dark Mode" : "Light Mode"}</span>
        </div>
        <h1>Trading Simulator</h1>
      </div>

      <div className="controls">
        <PairSelector selectedPair={selectedPair} onSelect={setSelectedPair} />
        {balance !== undefined ? (
          <Wallet balance={balance} />
        ) : (
          <Skeleton height="100px" />
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
            <OrderBook
              bids={orderBook.bids}
              asks={orderBook.asks}
              onOrderSelect={handleOrderSelect}
            />
          ) : (
            <Skeleton height="300px" />
          )}
        </div>
        <div className="order-form-container">
          <OrderForm
            onSubmit={handleOrderSubmit}
            balance={balance}
            pair={selectedPair}
            isDisabled={balance <= 0}
            selectedOrder={selectedOrder}
          />
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
