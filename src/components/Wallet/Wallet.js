import React from 'react';
import { Button } from '@mui/material';
import { useTradingContext } from '../../contexts/TradingContext';
import './Wallet.css';

function Wallet() {

  const { balance, updateBalance } = useTradingContext();

  const handleAddBalance = () => {
    updateBalance(10000);
  };

  return (
    <div className="wallet">
      <div className="wallet-inner">
        <h2>Balance</h2>
        <p>USDT : {balance?.toFixed(2)}</p>
        <Button 
          variant="contained" 
          onClick={handleAddBalance}
          size="small"
          style={{ backgroundColor: 'rgb(32, 100, 129)', color: '#ffffff' }}
        >
          Add Balance
        </Button>
      </div>
    </div>
  );
}

export default Wallet;