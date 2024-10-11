import React from 'react';

function TimeframeSelector({ selectedTimeframe, onSelect }) {
  return (
    <div>
      <label>Select Timeframe:</label>
      <select value={selectedTimeframe} onChange={(e) => onSelect(e.target.value)}>
        <option value="1m">1 min</option>
        <option value="5m">5 min</option>
        <option value="15m">15 min</option>
        <option value="1h">1 hour</option>
        <option value="4h">4 hours</option>
        <option value="1d">1 day</option>
      </select>
    </div>
  );
}

export default TimeframeSelector;