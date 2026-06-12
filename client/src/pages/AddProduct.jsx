import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Tag, DollarSign, Image, FileText, AlertCircle, PlusCircle } from 'lucide-react';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    imageUrl: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { name, price, imageUrl, description } = formData;

    // Validation
    if (!name || !price || !imageUrl || !description) {
      setError('All fields are required');
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Price must be a valid positive number');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/products', {
        name,
        price: parsedPrice,
        imageUrl,
        description
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred while adding product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '640px' }}>
      <div className="glass-panel" style={{ padding: '40px', borderRadius: '16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="page-title" style={{ fontSize: '2.2rem' }}>Add New Product</h1>
          <p style={{ color: 'hsl(var(--text-secondary))', marginTop: '4px' }}>Fill in details to showcase your product in the catalog</p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="product-name">Product Name</label>
            <div style={{ position: 'relative' }}>
              <Tag 
                size={18} 
                style={{ 
                  position: 'absolute', 
                  left: '16px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: 'hsl(var(--text-secondary))' 
                }} 
              />
              <input
                type="text"
                id="product-name"
                name="name"
                className="form-control"
                style={{ paddingLeft: '48px' }}
                placeholder="Premium Wireless Headphones"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="product-price">Price (USD)</label>
            <div style={{ position: 'relative' }}>
              <DollarSign 
                size={18} 
                style={{ 
                  position: 'absolute', 
                  left: '16px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: 'hsl(var(--text-secondary))' 
                }} 
              />
              <input
                type="number"
                step="0.01"
                id="product-price"
                name="price"
                className="form-control"
                style={{ paddingLeft: '48px' }}
                placeholder="99.99"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="product-image">Image URL</label>
            <div style={{ position: 'relative' }}>
              <Image 
                size={18} 
                style={{ 
                  position: 'absolute', 
                  left: '16px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: 'hsl(var(--text-secondary))' 
                }} 
              />
              <input
                type="url"
                id="product-image"
                name="imageUrl"
                className="form-control"
                style={{ paddingLeft: '48px' }}
                placeholder="https://images.unsplash.com/... or any image link"
                value={formData.imageUrl}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="product-desc">Description</label>
            <div style={{ position: 'relative' }}>
              <FileText 
                size={18} 
                style={{ 
                  position: 'absolute', 
                  left: '16px', 
                  top: '20px', 
                  color: 'hsl(var(--text-secondary))' 
                }} 
              />
              <textarea
                id="product-desc"
                name="description"
                className="form-control"
                style={{ paddingLeft: '48px', minHeight: '120px', resize: 'vertical' }}
                placeholder="Provide a detailed description of the product features, specifications..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              style={{ flex: 1 }}
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ flex: 2 }}
              disabled={loading}
            >
              <PlusCircle size={18} />
              {loading ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
