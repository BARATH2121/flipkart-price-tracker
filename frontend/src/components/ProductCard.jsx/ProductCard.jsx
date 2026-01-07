import { useState } from 'react'
import { Link } from 'react-router-dom'
import { productAPI } from '../services/api'
import './ProductCard.css'

const ProductCard = ({ product, onRemove }) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to remove this product?')) return
    
    try {
      setIsDeleting(true)
      await productAPI.deleteProduct(product.id)
      onRemove()
    } catch (err) {
      console.error('Failed to delete product:', err)
      alert('Failed to remove product')
    } finally {
      setIsDeleting(false)
    }
  }

  const priceChange = product.currentPrice - (product.previousPrice || product.currentPrice)
  const priceChangePercent = product.previousPrice 
    ? ((priceChange / product.previousPrice) * 100).toFixed(2)
    : 0

  return (
    <Link to={`/product/${product.id}`} className='product-card-link'>
      <div className='product-card'>
        <div className='product-image'>
          <img src={product.imageUrl} alt={product.name} />
          <div className={`stock-badge ${product.inStock ? 'in-stock' : 'out-stock'}`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </div>
        </div>
        
        <div className='product-info'>
          <h3 className='product-name'>{product.name}</h3>
          
          <div className='price-section'>
            <div className='current-price'>₹{product.currentPrice?.toLocaleString('en-IN')}</div>
            {product.previousPrice && (
              <div className={`price-change ${priceChange < 0 ? 'decrease' : 'increase'}`}>
                {priceChange < 0 ? '▼' : '▲'} {Math.abs(priceChangePercent)}%
              </div>
            )}
          </div>
          
          {product.originalPrice && (
            <div className='original-price'>₹{product.originalPrice?.toLocaleString('en-IN')}</div>
          )}
          
          <div className='product-meta'>
            <span className='rating'>★ {product.rating || 'N/A'}</span>
            <span className='reviews'>({product.reviewCount || 0} reviews)</span>
          </div>
          
          <div className='product-actions'>
            <button 
              className='delete-btn'
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={isDeleting}
            >
              {isDeleting ? 'Removing...' : 'Remove'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
