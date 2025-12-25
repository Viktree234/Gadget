import { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import api from '../../services/api';
import './AdminOrders.css';

function AdminOrders() {
  const { token } = useAdmin();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await api.getAdminOrders(token, { 
        status: statusFilter || undefined 
      });
      if (response.success) {
        setOrders(response.orders);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(token, orderId, newStatus, '');
      await loadOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      alert('Error updating order: ' + error.message);
    }
  };

  const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
    try {
      await api.updateOrderPaymentStatus(token, orderId, newPaymentStatus);
      await loadOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, paymentStatus: newPaymentStatus });
      }
    } catch (error) {
      alert('Error updating payment status: ' + error.message);
    }
  };

  const viewOrder = async (orderId) => {
    try {
      const response = await api.getAdminOrder(token, orderId);
      if (response.success) {
        setSelectedOrder(response.order);
      }
    } catch (error) {
      alert('Error loading order: ' + error.message);
    }
  };

  if (loading) {
    return <div className="admin-page">Loading orders...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Orders Management</h1>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.orderNumber}</td>
                <td>
                  <div>
                    <div>{order.customerInfo.name}</div>
                    <div className="customer-email">{order.customerInfo.email}</div>
                  </div>
                </td>
                <td>{order.items.length} item(s)</td>
                <td>${order.total.toFixed(2)}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`status-select status-${order.status}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <select
                    value={order.paymentStatus}
                    onChange={(e) => handlePaymentStatusChange(order._id, e.target.value)}
                    className={`payment-select payment-${order.paymentStatus}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn-view" onClick={() => viewOrder(order._id)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content order-detail-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Order Details - {selectedOrder.orderNumber}</h2>
            
            <div className="order-detail-section">
              <h3>Customer Information</h3>
              <p><strong>Name:</strong> {selectedOrder.customerInfo.name}</p>
              <p><strong>Email:</strong> {selectedOrder.customerInfo.email}</p>
              {selectedOrder.customerInfo.phone && (
                <p><strong>Phone:</strong> {selectedOrder.customerInfo.phone}</p>
              )}
              {selectedOrder.customerInfo.address && (
                <div>
                  <strong>Address:</strong>
                  <p>{selectedOrder.customerInfo.address.street}<br />
                  {selectedOrder.customerInfo.address.city}, {selectedOrder.customerInfo.address.state} {selectedOrder.customerInfo.address.zipCode}</p>
                </div>
              )}
            </div>

            <div className="order-detail-section">
              <h3>Order Items</h3>
              <div className="order-items">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={item.image} alt={item.name} />
                    <div>
                      <h4>{item.name}</h4>
                      <p>Quantity: {item.quantity} × ${item.price} = ${(item.quantity * item.price).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-detail-section">
              <div className="order-summary">
                <p><strong>Subtotal:</strong> ${selectedOrder.total.toFixed(2)}</p>
                <p><strong>Total:</strong> ${selectedOrder.total.toFixed(2)}</p>
                <p><strong>Status:</strong> <span className={`status-badge status-${selectedOrder.status}`}>{selectedOrder.status}</span></p>
                <p><strong>Payment Status:</strong> <span className={`payment-badge payment-${selectedOrder.paymentStatus}`}>{selectedOrder.paymentStatus}</span></p>
              </div>
            </div>

            <button className="btn-primary" onClick={() => setSelectedOrder(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;

