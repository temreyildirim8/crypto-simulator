import React from 'react';
import './Wallet.css';

function Wallet({ balance }) {
  return (
    <div className="wallet">
      <div className="wallet-inner">
        <h2>Wallet</h2>
        <p>USDT: {balance.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default Wallet;