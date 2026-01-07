import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProductDetail, updateNotificationSettings } from '../services/api';
import PriceChart from '../components/PriceChart';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [priceThreshold, setPriceThreshold] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const data = await getProductDetail(productId);
        setProduct(data);
        setPriceThreshold(data.priceThreshold || '');
      } catch (err) {
        setError(err.message || 'Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetail();
    }
  }, [productId]);

  const handleUpdateThreshold = async () => {
    if (!priceThreshold || isNaN(priceThreshold) || priceThreshold <= 0) {
      setError('Please enter a valid price threshold');
      return;
    }

    setSaving(true);
    try {
      await updateNotificationSettings(productId, {
        priceThreshold: parseFloat(priceThreshold),
      });
      setProduct({ ...product, priceThreshold: parseFloat(priceThreshold) });
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading product details...</div>;
  }

  if (error && !product) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  if (!product) {
    return <div className="not-found">Product not found</div>;
  }

  return (
    <div className="product-detail-container">
      <button className="back-button" onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>

      <div className="product-detail-header">
        <h1>{product.name}</h1>
        <a href={product.url} target="_blank" rel="noopener noreferrer" className="product-link">
          View on Flipkart ↗
        </a>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="product-detail-content">
        <div className="product-info">
          <div className="info-card">
            <h3>Current Price</h3>
            <p className="price">₹{product.currentPrice?.toLocaleString() || 'N/A'}</p>
          </div>

          <div className="info-card">
            <h3>Original Price</h3>
            <p className="original-price">₹{product.originalPrice?.toLocaleString() || 'N/A'}</p>
          </div>

          <div className="info-card">
            <h3>Stock Status</h3>
            <p className={`stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
              {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
            </p>
          </div>

          <div className="info-card">
            <h3>Price Drop</h3>
            <p className="price-drop">
              {product.priceDropPercentage ? (
                <span className="drop-badge">{product.priceDropPercentage}% ↓</span>
              ) : (
                'No change'
              )}
            </p>
          </div>
        </div>

        <div className="threshold-settings">
          <h3>Price Alert Settings</h3>
          <div className="threshold-form">
            <label htmlFor="threshold">Alert me when price drops below:</label>
            <div className="input-group">
              <span className="currency">₹</span>
              <input
                id="threshold"
                type="number"
                value={priceThreshold}
                onChange={(e) => setPriceThreshold(e.target.value)}
                placeholder="Enter threshold price"
                disabled={saving}
              />
            </div>
            <button
              className="update-button"
              onClick={handleUpdateThreshold}
              disabled={saving}
            >
              {saving ? 'Updating...' : 'Update Threshold'}
            </button>
          </div>
        </div>
      </div>

      <div className="price-history">
        <PriceChart priceData={product.priceHistory || []} />
      </div>
    </div>
  );
};

export default ProductDetail;
