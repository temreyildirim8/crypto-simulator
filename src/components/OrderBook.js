import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const OrderBook = ({ bids, asks }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Price</TableCell>
            <TableCell>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {asks?.map((ask, index) => (
            <TableRow key={`ask-${index}`}>
              <TableCell>{ask.price}</TableCell>
              <TableCell>{ask.amount}</TableCell>
            </TableRow>
          ))}
          {bids?.map((bid, index) => (
            <TableRow key={`bid-${index}`}>
              <TableCell>{bid.price}</TableCell>
              <TableCell>{bid.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderBook;