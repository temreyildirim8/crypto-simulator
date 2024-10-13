import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

function PairSelector({ selectedPair, onSelect }) {
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="pair-selector-label">Select Pair</InputLabel>
        <Select
          labelId="pair-selector-label"
          id="pair-selector"
          value={selectedPair}
          label="Select Pair"
          onChange={(e) => onSelect(e.target.value)}
        >
          <MenuItem value="BTCUSDT">BTC/USDT</MenuItem>
          <MenuItem value="ETHUSDT">ETH/USDT</MenuItem>
          <MenuItem value="LTCUSDT">LTC/USDT</MenuItem>
          <MenuItem value="XRPUSDT">XRP/USDT</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

export default PairSelector;