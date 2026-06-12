import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import { AuthContext } from '../context/AuthContext';
import { Heart, Edit, ShoppingBag, Loader, AlertTriangle, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [likedIds, setLikedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, likedRes] = await Promise.all([
        apiClient.get(`/api/products?page=${page}&limit=8`),
        apiClient.get('/api/products/liked')
      ]);
      setProducts(productsRes.data.products);
      setTotalPages(productsRes.data.pagination.pages);
      setTotalProducts(productsRes.data.pagination.total);
      setLikedIds(likedRes.data.map(p => p._id));
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleLike = async (productId) => {
    try {
      const res = await apiClient.post(`/api/products/${productId}/like`);
      if (res.data.isLiked) {
        setLikedIds([...likedIds, productId]);
      } else {
        setLikedIds(likedIds.filter(id => id !== productId));
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await apiClient.delete(`/api/products/${productId}`);
        // Refresh catalog list
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting product');
      }
    }
  };

  if (loading) {
    return (
      <div className="container text-center" style={{ padding: '80px 0' }}>
        <Loader className="animate-spin" size={48} style={{ color: 'hsl(var(--primary))', margin: '0 auto 16px' }} />
        <p style={{ color: 'hsl(var(--text-secondary))' }}>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Explore Catalog</h1>
          <p style={{ color: 'hsl(var(--text-secondary))', marginTop: '4px' }}>Discover the latest items curated for you</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'hsl(var(--text-secondary))', fontSize: '0.9rem' }}>
          <ShoppingBag size={18} />
          <span>{totalProducts} products available</span>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {products.length === 0 ? (
        <div className="glass-panel text-center" style={{ padding: '60px 20px', borderRadius: '16px' }}>
          <ShoppingBag size={48} style={{ color: 'hsl(var(--text-secondary))', marginBottom: '16px' }} />
          <h3>No Products Found</h3>
          <p style={{ color: 'hsl(var(--text-secondary))', marginTop: '8px', marginBottom: '24px' }}>
            Be the first one to add a product to the catalog!
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/add-product')}>
            Add Product
          </button>
        </div>
      ) : (
        <>
          <div className="product-grid">
            {products.map((product) => {
              const isLiked = likedIds.includes(product._id);
              const isOwner = user && product.owner && (product.owner._id === user.id || product.owner === user.id);
              return (
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
                        className={`like-button ${isLiked ? 'liked' : ''}`}
                        onClick={() => handleLike(product._id)}
                      >
                        <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                        <span>{isLiked ? 'Liked' : 'Like'}</span>
                      </button>

                      {isOwner && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="edit-button"
                            onClick={() => navigate(`/edit-product/${product._id}`, { state: { product } })}
                            style={{ color: 'hsl(var(--accent))' }}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="edit-button"
                            onClick={() => handleDelete(product._id)}
                            style={{ color: 'hsl(var(--danger))' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '48px' }}>
              <button 
                className="btn btn-secondary"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                style={{ padding: '8px 16px' }}
              >
                <ChevronLeft size={18} />
                <span>Prev</span>
              </button>
              
              <span style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.95rem' }}>
                Page <strong style={{ color: '#fff' }}>{page}</strong> of {totalPages}
              </span>
              
              <button 
                className="btn btn-secondary"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                style={{ padding: '8px 16px' }}
              >
                <span>Next</span>
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
