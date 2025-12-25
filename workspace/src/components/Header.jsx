import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Header.css'
import api from '../services/api'
import { useCart } from '../context/CartContext'

function Header({ mobileMenuOpen, setMobileMenuOpen, onSearchResults }) {
  const [searchQuery, setSearchQuery] = useState('')
  const { cart } = useCart()
  const navigate = useNavigate()

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    try {
      const response = await api.searchProducts(searchQuery)
      if (onSearchResults) {
        onSearchResults(response.products || [])
      }
      // Navigate to home page and scroll to trending section
      navigate('/')
      setTimeout(() => {
        const trendingSection = document.getElementById('trending')
        if (trendingSection) {
          trendingSection.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } catch (error) {
      console.error('Search error:', error)
      if (onSearchResults) {
        onSearchResults([])
      }
    }
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">✕</span>
          <span className="logo-text">Sergent Gadgets</span>
        </Link>

        <button className="menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav ${mobileMenuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>SHOP</Link>
          <Link to="/#trending" onClick={() => setMobileMenuOpen(false)}>NEW ARRIVALS</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>SUPPORT</Link>
        </nav>

        <div className="header-right">
          <Link to="/cart" className="cart-icon">
            <span className="cart-icon-symbol">🛒</span>
            {cart.itemCount > 0 && (
              <span className="cart-count">{cart.itemCount}</span>
            )}
          </Link>
          <form className="search-bar" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </form>
          <button className="search-icon-mobile" onClick={handleSearch}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
