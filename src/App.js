import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TradingSimulator from './components/TradingSimulator/TradingSimulator';
import './index.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container">
        <TradingSimulator />
      </div>
    </QueryClientProvider>
  );
}

export default App;