import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TradingSimulator from './components/TradingSimulator/TradingSimulator';
import { TradingProvider } from './contexts/TradingContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TradingProvider>
        <div className="container">
          <TradingSimulator />
          <ToastContainer 
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </TradingProvider>
    </QueryClientProvider>
  );
}

export default App;