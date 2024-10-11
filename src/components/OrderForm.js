import React, { useState } from 'react';

function OrderForm({ onSubmit, balance, pair }) {
  const [orderType, setOrderType] = useState('BUY');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ orderType, price: parseFloat(price), quantity: parseFloat(quantity) });
    setPrice('');
    setQuantity('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Place Order</h2>
      <div>
        <label>
          Order Type:
          <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
            <option value="BUY">Buy</option>
            <option value="SELL">Sell</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Price:
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </label>
      </div>
      <div>
        <label>
          Quantity:
          <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
        </label>
      </div>
      <button type="submit">Place Order</button>
    </form>
  );
}

export default OrderForm;