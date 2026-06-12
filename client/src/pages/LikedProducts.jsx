import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, HeartOff, ShoppingBag, Loader, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LikedProducts = () => {
  const [likedProducts, setLikedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchLikedProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/products/liked');
      setLikedProducts(res.data);
    } catch (err) {
      setError('Failed to load liked products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedProducts();
  }, []);

  const handleUnlike = async (productId) => {
    try {
      await axios.post(`/api/products/${productId}/like`);
      // Immediately filter out from the liked products list view
      setLikedProducts(likedProducts.filter(p => p._id !== productId));
    } catch (err) {
      console.error('Error toggling unlike:', err);
    }
  };

  if (loading) {
    return (
      <div className="container text-center" style={{ padding: '80px 0' }}>
        <Loader className="animate-spin" size={48} style={{ color: 'hsl(var(--primary))', margin: '0 auto 16px' }} />
        <p style={{ color: 'hsl(var(--text-secondary))' }}>Loading liked items...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Liked Products</h1>
          <p style={{ color: 'hsl(var(--text-secondary))', marginTop: '4px' }}>Items you've added to your favorites catalog</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {likedProducts.length === 0 ? (
        <div className="glass-panel text-center" style={{ padding: '60px 20px', borderRadius: '16px' }}>
          <HeartOff size={48} style={{ color: 'hsl(var(--text-secondary))', marginBottom: '16px' }} />
          <h3>No Liked Products</h3>
          <p style={{ color: 'hsl(var(--text-secondary))', marginTop: '8px', marginBottom: '24px' }}>
            Browse products and click the like button to add items here.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Explore Products
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {likedProducts.map((product) => (
            <div key={product._id} className="glass-card product-card">
              <div className="product-image-container">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="product-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <div className="product-price">${product.price.toFixed(2)}</div>
                <p className="product-desc">{product.description}</p>
                
                <div className="product-actions">
                  <button 
                    className="like-button liked"
                    onClick={() => handleUnlike(product._id)}
                  >
                    <Heart size={18} fill="currentColor" />
                    <span>Unlike</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedProducts;
