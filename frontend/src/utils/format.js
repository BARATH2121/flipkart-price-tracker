// Format price with Indian Rupee currency
export const formatPrice = (price) => {
  if (!price) return '₹0'
  return `₹${Number(price).toLocaleString('en-IN')}`
}

// Format date to readable format
export const formatDate = (date) => {
  if (!date) return '-'
  const dateObj = new Date(date)
  return dateObj.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Format date with time
export const formatDateTime = (date) => {
  if (!date) return '-'
  const dateObj = new Date(date)
  return dateObj.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Format price change percentage
export const formatPriceChange = (oldPrice, newPrice) => {
  if (!oldPrice || !newPrice) return '0%'
  const change = ((newPrice - oldPrice) / oldPrice) * 100
  return change.toFixed(2) + '%'
}

// Truncate long text
export const truncateText = (text, length = 50) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

// Format product name
export const formatProductName = (name) => {
  if (!name) return 'Unknown Product'
  return truncateText(name, 60)
}

// Format status text
export const formatStatus = (status) => {
  const statusMap = {
    in_stock: 'In Stock',
    out_of_stock: 'Out of Stock',
    limited_stock: 'Limited Stock',
  }
  return statusMap[status] || status
}

// Get relative time (e.g., "2 hours ago")
export const getRelativeTime = (date) => {
  if (!date) return '-'
  const dateObj = new Date(date)
  const now = new Date()
  const seconds = Math.floor((now - dateObj) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return formatDate(date)
}

// Format notification text
export const formatNotificationText = (type, product) => {
  const messages = {
    price_drop: `Price of ${product.name} dropped to ${formatPrice(product.price)}`,
    threshold_reached: `${product.name} reached threshold price of ${formatPrice(product.threshold)}`,
    out_of_stock: `${product.name} is now out of stock`,
    back_in_stock: `${product.name} is back in stock`,
  }
  return messages[type] || 'Product update received'
}
