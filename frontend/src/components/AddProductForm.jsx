import { useState } from 'react';
import { validateFlipkartURL } from '../utils/validation';
import '../styles/AddProductForm.css';

const AddProductForm = ({ onAddProduct }) => {
  const [url, setUrl] = useState('');
  const [priceThreshold, setPriceThreshold] = useState('');
  const [notificationEmail, setNotificationEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate URL
    if (!validateFlipkartURL(url)) {
      setError('Please enter a valid Flipkart product URL');
      return;
    }

    if (!priceThreshold || isNaN(priceThreshold) || priceThreshold <= 0) {
      setError('Please enter a valid price threshold');
      return;
    }

    if (!notificationEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(notificationEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      await onAddProduct({
        url,
        priceThreshold: parseFloat(priceThreshold),
        notificationEmail,
      });

      // Reset form
      setUrl('');
      setPriceThreshold('');
      setNotificationEmail('');
    } catch (err) {
      setError(err.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-form-container">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit} className="add-product-form">
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="url">Flipkart Product URL</label>
          <input
            id="url"
            type="text"
            placeholder="https://www.flipkart.com/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="threshold">Price Alert Threshold (₹)</label>
          <input
            id="threshold"
            type="number"
            placeholder="Enter minimum price"
            value={priceThreshold}
            onChange={(e) => setPriceThreshold(e.target.value)}
            disabled={loading}
            step="0.01"
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Notification Email</label>
          <input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={notificationEmail}
            onChange={(e) => setNotificationEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
