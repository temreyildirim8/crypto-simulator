import React from 'react';
import './OrderHistory.css';

function OrderHistory({ orders, onCancel }) {

  return (
    <div className="order-history">
      <h2>Order History</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Coin</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.orderType}</td>
              <td>{order.price}</td>
              <td>{order.quantity}</td>
              <td>{order.pair}</td>
              <td>{order.status}</td>
              <td>
                {order.status === 'Pending' ? (
                  <button onClick={() => onCancel(order.id)}>Cancel</button>
                ) : (
                  <span className="placeholder">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderHistory;