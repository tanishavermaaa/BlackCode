import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Tag, DollarSign, Image, FileText, AlertCircle, Save } from 'lucide-react';

const EditProduct = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    imageUrl: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Attempt to read product details from route state
    if (location.state?.product) {
      const { name, price, imageUrl, description } = location.state.product;
      setFormData({ name, price: price.toString(), imageUrl, description });
    } else {
      // Fallback: Fetch all products and filter (since we don't have single product GET endpoint)
      const fetchProduct = async () => {
        try {
          const res = await axios.get('/api/products');
          const found = res.data.find(p => p._id === id);
          if (found) {
            setFormData({
              name: found.name,
              price: found.price.toString(),
              imageUrl: found.imageUrl,
              description: found.description
            });
          } else {
            setError('Product not found');
          }
        } catch (err) {
          setError('Failed to fetch product details');
        }
      };
      fetchProduct();
    }
  }, [id, location.state]);

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
      await axios.put(`/api/products/${id}`, {
        name,
        price: parsedPrice,
        imageUrl,
        description
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred while updating product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '640px' }}>
      <div className="glass-panel" style={{ padding: '40px', borderRadius: '16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="page-title" style={{ fontSize: '2.2rem' }}>Edit Product</h1>
          <p style={{ color: 'hsl(var(--text-secondary))', marginTop: '4px' }}>Update the specifications and details of the product</p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="edit-name">Product Name</label>
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
                id="edit-name"
                name="name"
                className="form-control"
                style={{ paddingLeft: '48px' }}
                placeholder="Product Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-price">Price (USD)</label>
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
                id="edit-price"
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
            <label className="form-label" htmlFor="edit-image">Image URL</label>
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
                id="edit-image"
                name="imageUrl"
                className="form-control"
                style={{ paddingLeft: '48px' }}
                placeholder="Image URL"
                value={formData.imageUrl}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-desc">Description</label>
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
                id="edit-desc"
                name="description"
                className="form-control"
                style={{ paddingLeft: '48px', minHeight: '120px', resize: 'vertical' }}
                placeholder="Product description"
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
              <Save size={18} />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
