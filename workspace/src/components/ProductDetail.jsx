import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await api.getProduct(id);
      if (response.success) {
        setProduct(response.product);
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product.inStock) {
      setMessage('Product is out of stock');
      return;
    }

    const result = await addToCart(product._id, quantity);
    if (result.success) {
      setMessage('Added to cart!');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(result.message || 'Failed to add to cart');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="product-detail">
        <div className="product-detail-container">
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail">
        <div className="product-detail-container">
          <p>Product not found</p>
          <button onClick={() => navigate('/')}>Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="product-detail-content">
          <div className="product-image-section">
            <img src={product.image} alt={product.name} />
            {product.badge && <span className="product-badge">{product.badge}</span>}
          </div>

          <div className="product-info-section">
            <h1>{product.name}</h1>
            <div className="product-rating">
              {'★'.repeat(Math.floor(product.rating))}
              <span>{product.rating}</span>
            </div>
            <div className="product-price">${product.price}</div>
            
            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            <div className="product-stock">
              <span className={product.inStock ? 'in-stock' : 'out-of-stock'}>
                {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
              </span>
            </div>

            {product.inStock && (
              <div className="product-actions">
                <div className="quantity-selector">
                  <label>Quantity:</label>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>

                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                  Add to Cart
                </button>

                {message && <div className={`message ${message.includes('Added') ? 'success' : 'error'}`}>{message}</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;

