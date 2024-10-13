import React from 'react';
import './OrderHistory.css';

function OrderHistory({ orders, onCancel }) {
  return (
    <div className="order-history">
      <h2>Order History</h2>

      {/* Mobile View */}
      <div className="mobile-order-list">
        {orders?.map((order) => (
          <div className="order-item" key={order.id}>
            <div><strong>ID:</strong> {order.id}</div>
            <div><strong>Type:</strong> {order.orderType}</div>
            <div><strong>Price:</strong> ${order.price.toFixed(2)}</div>
            <div><strong>Quantity:</strong> {order.quantity}</div>
            <div><strong>Total:</strong> ${(order.price * order.quantity).toFixed(2)}</div>
            <div><strong>Pair:</strong> {order.pair}</div>
            <div><strong>Created At:</strong> {new Date(order.orderCreationDate).toLocaleString()}</div>
            <div><strong>Completed At:</strong> {order.orderCompleteDate ? new Date(order.orderCompleteDate).toLocaleString() : '-'}</div>
            <div><strong>Status:</strong> {order.status}</div>
            <div>
              {order.status === 'Pending' ? (
                <button onClick={() => onCancel(order.id)}>Cancel</button>
              ) : (
                null
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Pair</th>
            <th>Created At</th>
            <th>Completed At</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.orderType}</td>
              <td>${order.price.toFixed(2)}</td>
              <td>{order.quantity}</td>
              <td>${(order.price * order.quantity).toFixed(2)}</td>
              <td>{order.pair}</td>
              <td>{new Date(order.orderCreationDate).toLocaleString()}</td>
              <td>{order.orderCompleteDate ? new Date(order.orderCompleteDate).toLocaleString() : '-'}</td>
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