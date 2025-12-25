import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AdminProvider, useAdmin } from './context/AdminContext'
import Header from './components/Header'
import Hero from './components/Hero'
import Categories from './components/Categories'
import Trending from './components/Trending'
import ProductDetail from './components/ProductDetail'
import Cart from './components/Cart'
import Contact from './components/Contact'
import AdminLogin from './components/admin/AdminLogin'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './components/admin/AdminDashboard'
import AdminProducts from './components/admin/AdminProducts'
import AdminOrders from './components/admin/AdminOrders'
import AdminSales from './components/admin/AdminSales'
import Checkout from './components/Checkout'
import OrderSuccess from './components/OrderSuccess'
import './App.css'

function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <Hero />
      <Categories />
      <div id="trending">
        <Trending />
      </div>
    </>
  )
}

function AdminRoute({ children }) {
  const { isAuthenticated, loading } = useAdmin();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }
  
  return <AdminLayout>{children}</AdminLayout>;
}

function App() {
  return (
    <CartProvider>
      <AdminProvider>
        <Router>
          <div className="app">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={
                <>
                  <Header mobileMenuOpen={false} setMobileMenuOpen={() => {}} />
                  <ProductDetail />
                </>
              } />
              <Route path="/cart" element={
                <>
                  <Header mobileMenuOpen={false} setMobileMenuOpen={() => {}} />
                  <Cart />
                </>
              } />
              <Route path="/contact" element={
                <>
                  <Header mobileMenuOpen={false} setMobileMenuOpen={() => {}} />
                  <Contact />
                </>
              } />
              <Route path="/checkout" element={
                <>
                  <Header mobileMenuOpen={false} setMobileMenuOpen={() => {}} />
                  <Checkout />
                </>
              } />
              <Route path="/order-success/:orderNumber" element={
                <>
                  <Header mobileMenuOpen={false} setMobileMenuOpen={() => {}} />
                  <OrderSuccess />
                </>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/admin/products" element={
                <AdminRoute>
                  <AdminProducts />
                </AdminRoute>
              } />
              <Route path="/admin/orders" element={
                <AdminRoute>
                  <AdminOrders />
                </AdminRoute>
              } />
              <Route path="/admin/sales" element={
                <AdminRoute>
                  <AdminSales />
                </AdminRoute>
              } />
            </Routes>
          </div>
        </Router>
      </AdminProvider>
    </CartProvider>
  )
}

export default App
