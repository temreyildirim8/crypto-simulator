import React, { useState, useEffect } from 'react';
import './OrderForm.css';

function OrderForm({ onSubmit, balance, pair, lastPrice, isDisabled }) {
  const [orderType, setOrderType] = useState('BUY');
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
    const maxQuantity = orderType === 'BUY' ? balance / parseFloat(price || 1) : balance;
    const newQuantity = (maxQuantity * balancePercent) / 100;
    setQuantity(newQuantity.toFixed(8));
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseFloat(e.target.value);
    setQuantity(e.target.value);
    const maxQuantity = orderType === 'BUY' ? balance / parseFloat(price || 1) : balance;
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
            <option value="BUY">Buy</option>
            <option value="SELL">Sell</option>
          </select>
        </label>
      </div>
      <div className="form-group">
        <label>
          Price:
          <input type="number" value={price} onChange={handlePriceChange} required min="0" step="0.01" />
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
            step="1" 
            value={balancePercent} 
            onChange={handleBalancePercentChange}
          />
          <span>{balancePercent.toFixed(0)}%</span>
        </label>
      </div>

      <button type="submit" disabled={isDisabled}>Place Order</button>
    </form>
  );
}

export default OrderForm;