import React from 'react';

function PairSelector({ selectedPair, selectedTimeframe, onSelect, onTimeframeChange }) {
  return (
    <div>
      <label>Select Pair:</label>
      <select value={selectedPair} onChange={(e) => onSelect(e.target.value)}>
        <option value="BTCUSDT">BTC/USDT</option>
        <option value="ETHUSDT">ETH/USDT</option>
        <option value="LTCUSDT">LTC/USDT</option>
        <option value="XRPUSDT">XRP/USDT</option>
      </select>
    </div>
  );
}

export default PairSelector;