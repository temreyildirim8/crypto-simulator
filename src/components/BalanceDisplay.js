import React from 'react';

function BalanceDisplay({ balance, lastPrice }) {
  return (
    <div>
      <h2>Balance: {balance.toFixed(2)} USDT</h2>
      {lastPrice && <h3>Last Price: {lastPrice.toFixed(2)} USDT</h3>}
    </div>
  );
}

export default BalanceDisplay;