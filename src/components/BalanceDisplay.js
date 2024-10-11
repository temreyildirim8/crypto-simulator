import React from 'react';

function BalanceDisplay({ balance }) {
  return (
    <div>
      <h2>Balance: {balance.toFixed(2)} USDT</h2>
    </div>
  );
}

export default BalanceDisplay;