import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const OrderBook = ({ bids, asks }) => {
  return (
    <Paper sx={{ p: 2 }}>
      <h2>Order Book</h2>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ width: '50%', pr: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'right' }}>Asks</Typography>
          {asks?.map((ask, index) => (
            <Box key={`ask-${index}`} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="error">{ask.price}</Typography>
              <Typography>{ask.amount}</Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ width: '50%', pl: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Bids</Typography>
          {bids?.map((bid, index) => (
            <Box key={`bid-${index}`} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="success.main">{bid.price}</Typography>
              <Typography>{bid.amount}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default OrderBook;