/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Button,
  Typography,
  Box,
} from "@mui/material";

function OrderForm({
  onSubmit,
  balance,
  lastPrice,
  isDisabled,
  selectedOrder,
}) {
  const [orderType, setOrderType] = useState("BUY_LIMIT");
  const [price, setPrice] = useState(lastPrice?.toString() || "");
  const [quantity, setQuantity] = useState("");
  const [balancePercent, setBalancePercent] = useState(0);

  useEffect(() => {
    if (lastPrice) {
      setPrice(lastPrice.toString());
    }
  }, [lastPrice]);

  useEffect(() => {
    updateQuantityFromBalancePercent();
  }, [balancePercent, price, orderType, balance]);

  useEffect(() => {
    if (selectedOrder) {
      setOrderType(selectedOrder.type);
      setPrice(selectedOrder.price.toString());
      setQuantity(selectedOrder.amount.toString());
      updateBalancePercentFromQuantity(selectedOrder.amount);
    }
  }, [selectedOrder]);

  const isButtonDisabled = useMemo(() => {
    return (
      isDisabled ||
      balance <= 0 ||
      quantity <= 0 ||
      quantity * price <= 1 ||
      balancePercent <= 0
    );
  }, [isDisabled, balance, quantity, balancePercent, price]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      orderType,
      price: parseFloat(price),
      quantity: parseFloat(quantity),
    });
    setQuantity("");
    setBalancePercent(0);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
    updateQuantityFromBalancePercent();
  };

  const handleBalancePercentChange = (event, newValue) => {
    setBalancePercent(newValue);
  };

  const updateQuantityFromBalancePercent = () => {
    const maxQuantity = orderType.includes("BUY")
      ? balance / parseFloat(price || 1)
      : balance;
    const newQuantity = (maxQuantity * balancePercent) / 100;
    if (Math.sign(newQuantity) === 1) {
      setQuantity(newQuantity.toFixed(8));
    }
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseFloat(e.target.value);
    setQuantity(e.target.value);
    updateBalancePercentFromQuantity(newQuantity);
  };

  const updateBalancePercentFromQuantity = (newQuantity) => {
    const maxQuantity = orderType.includes("BUY")
      ? balance / parseFloat(price || 1)
      : balance;
    const newBalancePercent = (newQuantity / maxQuantity) * 100;
    setBalancePercent(newBalancePercent);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ p: 3, bgcolor: "#ffffff", borderRadius: 2, boxShadow: 1 }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Place Order
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel id="order-type-label">Order Type</InputLabel>
        <Select
          labelId="order-type-label"
          value={orderType}
          onChange={(e) => setOrderType(e.target.value)}
          label="Order Type"
        >
          <MenuItem value="BUY_LIMIT">Buy Limit</MenuItem>
          <MenuItem value="SELL_LIMIT">Sell Limit</MenuItem>
          <MenuItem value="MARKET_BUY">Market Buy</MenuItem>
          <MenuItem value="MARKET_SELL">Market Sell</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        margin="normal"
        label="Price"
        type="number"
        value={price}
        onChange={handlePriceChange}
        required
        slotProps={{
          input: {
            min: "0",
            step: "0.0000001"
          }
        }}
        disabled={orderType.includes("MARKET")}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Quantity"
        type="number"
        value={quantity}
        onChange={handleQuantityChange}
        required
        slotProps={{
          input: {
            min: "0",
            step: "0.0000001",
          },
        }}
      />
      <Box sx={{ mt: 2, mb: 1 }}>
        <Typography gutterBottom>Balance Percent</Typography>
        <Slider
          value={balancePercent}
          onChange={handleBalancePercentChange}
          valueLabelDisplay="auto"
          step={20}
          marks
          min={0}
          max={100}
          style={{ color: "rgb(32, 100, 129)" }}
        />
      </Box>
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isButtonDisabled}
        sx={{ mt: 2 }}
        style={{ backgroundColor: "rgb(32, 100, 129)" }}
      >
        {orderType.replace("_", " ")}
      </Button>
    </Box>
  );
}

export default OrderForm;
