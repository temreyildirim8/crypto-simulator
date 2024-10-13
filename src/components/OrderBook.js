import React from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';

const OrderBook = ({ bids, asks, onOrderSelect }) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Order Book</Typography>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ width: '50%', pr: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'right', }}>Asks</Typography>
          {asks?.map((ask, index) => (
            <Button
              key={`ask-${index}`}
              onClick={() => onOrderSelect('SELL_LIMIT', ask.price, ask.amount)}
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                width: '100%', 
                textTransform: 'none'
              }}
            >
              <Typography color="textPrimary">{ask.amount}</Typography>
              <Typography color="error">{ask.price}</Typography>
            </Button>
          ))}
        </Box>
        <Box sx={{ width: '50%', pl: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Bids</Typography>
          {bids?.map((bid, index) => (
            <Button
              key={`bid-${index}`}
              onClick={() => onOrderSelect('BUY_LIMIT', bid.price, bid.amount)}
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                width: '100%', 
                textTransform: 'none'
              }}
            >
              <Typography color="success.main">{bid.price}</Typography>
              <Typography color="textPrimary">{bid.amount}</Typography>
            </Button>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default OrderBook;