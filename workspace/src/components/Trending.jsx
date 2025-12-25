import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Trending.css'
import api from '../services/api'

function Trending() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchTrendingProducts() {
      try {
        setLoading(true)
        const response = await api.getTrendingProducts()
        setProducts(response.products || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching trending products:', err)
        setError('Failed to load products')
        // Fallback to empty array on error
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingProducts()
  }, [])

  const formatPrice = (price) => {
    return `$${price}`
  }

  if (loading) {
    return (
      <section className="trending">
        <div className="trending-container">
          <div className="trending-header">
            <h2>TRENDING THIS WEEK</h2>
          </div>
          <div className="products-grid">
            <p>Loading products...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="trending">
        <div className="trending-container">
          <div className="trending-header">
            <h2>TRENDING THIS WEEK</h2>
          </div>
          <div className="products-grid">
            <p>{error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="trending">
      <div className="trending-container">
        <div className="trending-header">
          <h2>TRENDING THIS WEEK</h2>
        </div>
        <div className="products-grid">
          {products.length === 0 ? (
            <p>No trending products available</p>
          ) : (
            products.map((product) => (
              <Link key={product._id || product.id} to={`/product/${product._id || product.id}`} className="product-card">
                {product.badge && <div className="product-badge">{product.badge}</div>}
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-price">{formatPrice(product.price)}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export default Trending
