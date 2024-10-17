import React, { useEffect, useRef } from 'react';
import { useTheme } from "../contexts/ThemeContext";

const TradingViewChart = ({ symbol }) => {
  const { darkMode } = useTheme();
  const chartContainerRef = useRef();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Clear previous widget if any
    chartContainerRef.current.innerHTML = '';

    new window.TradingView.widget({
      container_id: chartContainerRef.current.id,
      width: '100%',
      height: '100%',
      symbol: symbol || 'BTCUSDT',
      interval: '60',
      timezone: 'Etc/UTC',
      theme: darkMode ? 'dark' : 'light',
      style: '1',
      locale: 'en',
      toolbar_bg: '#f1f3f6',
      enable_publishing: false,
      allow_symbol_change: true,
      details: true,
      hotlist: true,
      calendar: true,
      studies: [
        "MACD@tv-basicstudies",
        "RSI@tv-basicstudies"
      ],
      fullScreen: true
    });
  }, [symbol, darkMode]);

  return <div id="tradingview-chart" ref={chartContainerRef} style={{ height: '100vh' }} />;
};

export default TradingViewChart;