import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TradingSimulator from './components/TradingSimulator/TradingSimulator';
import { TradingProvider } from './contexts/TradingContext';
import './index.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TradingProvider>
        <div className="container">
          <TradingSimulator />
        </div>
      </TradingProvider>
    </QueryClientProvider>
  );
}

export default App;