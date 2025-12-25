import { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import api from '../../services/api';
import './AdminSales.css';

function AdminSales() {
  const { token } = useAdmin();
  const [sales, setSales] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      
      const response = await api.getAdminSales(token, filters);
      if (response.success) {
        setSales(response.sales);
      }
    } catch (error) {
      console.error('Error loading sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    loadSales();
  };

  if (loading) {
    return <div className="admin-page">Loading sales data...</div>;
  }

  if (!sales) {
    return <div className="admin-page">Failed to load sales data</div>;
  }

  return (
    <div className="admin-page">
      <h1>Sales & Revenue</h1>

      <form className="sales-filter" onSubmit={handleFilter}>
        <div className="filter-group">
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary">Filter</button>
        <button type="button" className="btn-secondary" onClick={() => {
          setStartDate('');
          setEndDate('');
          loadSales();
        }}>Clear</button>
      </form>

      <div className="sales-stats-grid">
        <div className="sales-stat-card">
          <h3>Total Revenue</h3>
          <p className="sales-stat-value">${sales.totalRevenue.toFixed(2)}</p>
        </div>

        <div className="sales-stat-card">
          <h3>Total Orders</h3>
          <p className="sales-stat-value">{sales.totalOrders}</p>
        </div>

        <div className="sales-stat-card">
          <h3>Average Order Value</h3>
          <p className="sales-stat-value">${sales.averageOrderValue.toFixed(2)}</p>
        </div>
      </div>

      <div className="sales-section">
        <h2>Orders by Status</h2>
        <div className="status-breakdown">
          {sales.ordersByStatus && sales.ordersByStatus.length > 0 ? (
            sales.ordersByStatus.map((status) => (
              <div key={status._id} className="status-item">
                <div className="status-name">{status._id}</div>
                <div className="status-count">{status.count} orders</div>
                <div className="status-revenue">${status.revenue.toFixed(2)}</div>
              </div>
            ))
          ) : (
            <p>No data available</p>
          )}
        </div>
      </div>

      <div className="sales-section">
        <h2>Daily Sales (Last 30 Days)</h2>
        {sales.dailySales && sales.dailySales.length > 0 ? (
          <div className="daily-sales-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Orders</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {sales.dailySales.map((day) => (
                  <tr key={day._id}>
                    <td>{day._id}</td>
                    <td>{day.count}</td>
                    <td>${day.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No daily sales data available</p>
        )}
      </div>
    </div>
  );
}

export default AdminSales;

