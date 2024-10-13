import React from 'react';
import './PairSelector.css';

function PairSelector({ selectedPair, onSelect }) {
  return (
    <div className="pair-selector">
      <label className="label">Select Pair:</label>
      <select 
        className="pair-selector-select"
        value={selectedPair} 
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="BTCUSDT">BTC/USDT</option>
        <option value="ETHUSDT">ETH/USDT</option>
        <option value="LTCUSDT">LTC/USDT</option>
        <option value="XRPUSDT">XRP/USDT</option>
      </select>
    </div>
  );
}

export default PairSelector;