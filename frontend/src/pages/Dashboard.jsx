import { useState, useEffect } from 'react'
import { productAPI } from '../services/api'
import ProductCard from '../components/ProductCard'
import AddProductForm from '../components/AddProductForm'
import './Dashboard.css'

const Dashboard = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await productAPI.getProducts()
      setProducts(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to load products')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleProductAdded = (newProduct) => {
    setProducts([newProduct, ...products])
    setShowAddForm(false)
  }

  const handleProductRemoved = (productId) => {
    setProducts(products.filter((p) => p.id !== productId))
  }

  if (loading) {
    return (
      <div className='dashboard-container'>
        <div className='loading'>Loading your products...</div>
      </div>
    )
  }

  return (
    <div className='dashboard-container'>
      <div className='dashboard-header'>
        <div>
          <h1>Price Tracker Dashboard</h1>
          <p className='subtitle'>Monitor your Flipkart products in real-time</p>
        </div>
        <button 
          className='add-product-btn'
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Close' : '+ Add Product'}
        </button>
      </div>

      {error && <div className='error-banner'>{error}</div>}

      {showAddForm && (
        <AddProductForm 
          onProductAdded={handleProductAdded}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <div className='products-section'>
        {products.length === 0 ? (
          <div className='empty-state'>
            <h2>No products tracked yet</h2>
            <p>Add your first Flipkart product to start tracking prices</p>
            <button 
              className='add-product-btn'
              onClick={() => setShowAddForm(true)}
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className='products-grid'>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onRemove={() => handleProductRemoved(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
