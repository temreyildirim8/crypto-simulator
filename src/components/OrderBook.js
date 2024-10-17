import React, { useState } from 'react';
import { Paper, Typography, Box, Button, Select, MenuItem, Pagination } from '@mui/material';
import { useTradingContext } from '../contexts/TradingContext';
import Big from 'big.js';

const OrderBook = ({ onOrderSelect }) => {
  const { orderBook, selectedTimeframe, setSelectedTimeframe } = useTradingContext();
  const [bidPage, setBidPage] = useState(1);
  const [askPage, setAskPage] = useState(1);
  const itemsPerPage = 20;

  const timeframes = ['1m', '5m', '15m', '1h', '12h'];

  const paginateOrders = (orders, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    return orders.slice(startIndex, startIndex + itemsPerPage);
  };

  const formatNumber = (num) => {
    return new Big(num).toFixed(5);
  };

  const bids = paginateOrders(orderBook.bids, bidPage);
  const asks = paginateOrders(orderBook.asks, askPage);

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Order Book</Typography>
        <Select
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value)}
          size="small"
        >
          {timeframes.map((tf) => (
            <MenuItem key={tf} value={tf}>{tf}</MenuItem>
          ))}
        </Select>
      </Box>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ width: '50%', mr: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'right' }}>Asks</Typography>
          {asks.map((ask, index) => (
            <Button
              key={`ask-${index}`}
              onClick={() => onOrderSelect('SELL_LIMIT', formatNumber(ask.price), formatNumber(ask.amount))}
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                width: '100%', 
                textTransform: 'none'
              }}
            >
              <Typography color="textPrimary">{formatNumber(ask.amount)}</Typography>
              <Typography color="error">{formatNumber(ask.price)}</Typography>
            </Button>
          ))}
          <Pagination 
            count={Math.ceil(orderBook.asks.length / itemsPerPage)} 
            page={askPage} 
            onChange={(e, page) => setAskPage(page)}
            sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
          />
        </Box>
        <Box sx={{ width: '50%', ml: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Bids</Typography>
          {bids.map((bid, index) => (
            <Button
              key={`bid-${index}`}
              onClick={() => onOrderSelect('BUY_LIMIT', formatNumber(bid.price), formatNumber(bid.amount))}
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                width: '100%', 
                textTransform: 'none'
              }}
            >
              <Typography color="success.main">{formatNumber(bid.price)}</Typography>
              <Typography color="textPrimary">{formatNumber(bid.amount)}</Typography>
            </Button>
          ))}
          <Pagination 
            count={Math.ceil(orderBook.bids.length / itemsPerPage)} 
            page={bidPage} 
            onChange={(e, page) => setBidPage(page)}
            sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default OrderBook;