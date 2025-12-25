import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import './AdminLayout.css';

function AdminLayout({ children }) {
  const { admin, logout } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
          <p className="admin-welcome">Welcome, {admin?.username}</p>
        </div>

        <nav className="admin-nav">
          <Link 
            to="/admin/dashboard" 
            className={isActive('/admin/dashboard') ? 'active' : ''}
          >
            📊 Dashboard
          </Link>
          <Link 
            to="/admin/products" 
            className={isActive('/admin/products') ? 'active' : ''}
          >
            📦 Products
          </Link>
          <Link 
            to="/admin/orders" 
            className={isActive('/admin/orders') ? 'active' : ''}
          >
            🛒 Orders
          </Link>
          <Link 
            to="/admin/sales" 
            className={isActive('/admin/sales') ? 'active' : ''}
          >
            💰 Sales
          </Link>
          <Link to="/" target="_blank">
            🌐 View Store
          </Link>
        </nav>

        <button className="admin-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="admin-content">
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;

