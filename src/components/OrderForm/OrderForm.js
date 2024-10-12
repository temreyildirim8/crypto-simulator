import React, { useState, useEffect, useMemo } from 'react';
import './OrderForm.css';

function OrderForm({ onSubmit, balance, pair, lastPrice, isDisabled }) {
  const [orderType, setOrderType] = useState('BUY_LIMIT');
  const [price, setPrice] = useState(lastPrice?.toString() || '');
  const [quantity, setQuantity] = useState('');
  const [balancePercent, setBalancePercent] = useState(0);

  useEffect(() => {
    if (lastPrice) {
      setPrice(lastPrice.toString());
    }
  }, [lastPrice]);

  useEffect(() => {
    updateQuantityFromBalancePercent();
  }, [balancePercent, price, orderType, balance]);

  const isButtonDisabled = useMemo(() => {
      return isDisabled || balance <= 0 || quantity <= 0 || quantity * price  <= 1 || balancePercent <= 0
  }, [isDisabled, balance, quantity, balancePercent, price])

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ orderType, price: parseFloat(price), quantity: parseFloat(quantity) });
    setQuantity('');
    setBalancePercent(0);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
    updateQuantityFromBalancePercent();
  };

  const handleBalancePercentChange = (e) => {
    setBalancePercent(parseFloat(e.target.value));
  };

  const updateQuantityFromBalancePercent = () => {
    const maxQuantity = orderType.includes('BUY') ? balance / parseFloat(price || 1) : balance;
    const newQuantity = (maxQuantity * balancePercent) / 100;
    setQuantity(newQuantity.toFixed(8));
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseFloat(e.target.value);
    setQuantity(e.target.value);
    const maxQuantity = orderType.includes('BUY') ? balance / parseFloat(price || 1) : balance;
    const newBalancePercent = (newQuantity / maxQuantity) * 100;
    setBalancePercent(newBalancePercent);
  };

  return (
    <form onSubmit={handleSubmit} className="order-form">
      <h2>Place Order</h2>
      <div className="form-group">
        <label>
          Order Type:
          <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
            <option value="BUY_LIMIT">Buy Limit</option>
            <option value="SELL_LIMIT">Sell Limit</option>
            <option value="MARKET_BUY">Market Buy</option>
            <option value="MARKET_SELL">Market Sell</option>
          </select>
        </label>
      </div>
      <div className="form-group">
        <label>
          Price:
          <input 
            type="number" 
            value={price} 
            onChange={handlePriceChange} 
            required 
            min="0" 
            step="0.01" 
            disabled={orderType.includes('MARKET')}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Quantity:
          <input 
            type="number" 
            value={quantity} 
            onChange={handleQuantityChange} 
            required 
            min="0" 
            step="0.00000001"
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Balance Percent:
          <input 
            type="range" 
            min="0" 
            max="100" 
            step="10" 
            value={balancePercent} 
            onChange={handleBalancePercentChange}
          />
          <span>{balancePercent.toFixed(0)}%</span>
        </label>
      </div>

      <button type="submit" disabled={isButtonDisabled}>
        {orderType.replace('_', ' ')}
      </button>
    </form>
  );
}

export default OrderForm;