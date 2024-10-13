import React from 'react';
import { FormControl, Typography, Select, MenuItem, Box } from '@mui/material';

function PairSelector({ selectedPair, onSelect }) {
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <Typography id="pair-selector-label" variant='span' color='textPrimary' textAlign={'right'} pr={1.6}>Select Pair:</Typography>
        <Select
          labelId="pair-selector-label"
          id="pair-selector"
          value={selectedPair}
          onChange={(e) => onSelect(e.target.value)}
          MenuProps={{
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            PaperProps: {
              sx: {
                '& .MuiMenuItem-root': {
                  justifyContent: 'flex-end',
                  marginRight: '10px',
                  paddingLeft: '10px'
                }
              }
            }
          }}
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