import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './OrderSuccess.css';

function OrderSuccess() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderNumber) {
      loadOrder();
    }
  }, [orderNumber]);

  const loadOrder = async () => {
    try {
      const response = await api.getOrder(orderNumber);
      if (response.success) {
        setOrder(response.order);
      }
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="order-success-page">Loading...</div>;
  }

  if (!order) {
    return (
      <div className="order-success-page">
        <div className="order-success-container">
          <p>Order not found</p>
          <button onClick={() => navigate('/')}>Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-success-page">
      <div className="order-success-container">
        <div className="success-icon">✓</div>
        <h1>Order Placed Successfully!</h1>
        <p className="order-number">Order Number: <strong>{order.orderNumber}</strong></p>
        
        <div className="order-details">
          <h2>Order Summary</h2>
          <div className="order-items">
            {order.items.map((item, index) => (
              <div key={index} className="order-item">
                <img src={item.image} alt={item.name} />
                <div>
                  <h4>{item.name}</h4>
                  <p>Quantity: {item.quantity} × ${item.price}</p>
                </div>
                <div className="item-total">${(item.quantity * item.price).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="order-total">
            <strong>Total: ${order.total.toFixed(2)}</strong>
          </div>
        </div>

        <div className="success-actions">
          <button onClick={() => navigate('/')}>Continue Shopping</button>
          <button className="secondary" onClick={() => navigate('/admin/orders')}>
            Track Order (Admin)
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;

