# 🚀 Frontend Development Guide - React + Vite

## Project Overview

Building a **React + Vite** frontend for the Flipkart Price Tracker with:
- ✅ User authentication (Login/Register)
- ✅ Dashboard with product tracking
- ✅ Price chart visualization
- ✅ Alert management
- ✅ Modern dark theme UI

---

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Custom CSS
- **State Management**: React Context API
- **Charts**: Chart.js / Recharts
- **HTTP Client**: Axios (pre-configured in api.js)
- **Form Handling**: React Hook Form
- **Routing**: React Router v6

---

## Project Structure

```
frontend/
├── src/
├── ├── pages/
├─┠── ├── Login.jsx
├┠── ├── Register.jsx
├┠── ├── Dashboard.jsx
├┠── ├── ProductDetail.jsx
├┠── ├── NotFound.jsx
├── ├── components/
├┠── ├── ProductCard.jsx
├┠── ├── AddProductForm.jsx
├┠── ├── PriceChart.jsx
├┠── ├── AlertSettings.jsx
├┠── ├── Navbar.jsx
├┠── ├── Footer.jsx
├── ├── context/
├┠── ├── AuthContext.jsx
├┠── ├── ProductContext.jsx
├── ├── services/
├┠── ├── api.js (already created)
├── ├── utils/
├┠── ├── constants.js (already created)
├┠── ├── validation.js
├┠── ├── helpers.js
├── ├── styles/
├┠── ├── Dashboard.css
├┠── ├── ProductCard.css
├┠── ├── global.css
├── App.jsx
├── main.jsx
├── .env.example
├── package.json
├── vite.config.js
└── index.html
```

---

## Setup Instructions

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Configure Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_AUTH_TOKEN_KEY=auth_token
VITE_DARK_MODE=true
```

### Step 3: Install Additional Packages

```bash
npm install axios react-router-dom chart.js recharts
npm install -D tailwindcss postcss autoprefixer
```

### Step 4: Start Development Server

```bash
npm run dev
```

Your app will be available at `http://localhost:5173`

---

## Component Development Workflow

### 1. Login Page (Login.jsx)

**Purpose**: User authentication

**Features**:
- Email/password input fields
- Form validation
- Error messages
- Link to register page
- Stores JWT token in localStorage

**Usage**:
```jsx
import { authAPI } from '../services/api'

const handleLogin = async (email, password) => {
  const response = await authAPI.login({ email, password })
  localStorage.setItem('auth_token', response.data.token)
  // Redirect to dashboard
}
```

### 2. Dashboard Page (Dashboard.jsx)

**Purpose**: Main user interface

**Features**:
- Display tracked products
- Add new product form
- Product filtering/search
- Quick stats (total products, price drops, alerts)
- Responsive grid layout

**Key Hooks**:
```jsx
const [products, setProducts] = useState([])
const [loading, setLoading] = useState(false)

useEffect(() => {
  fetchProducts()
}, [])

const fetchProducts = async () => {
  setLoading(true)
  try {
    const response = await productAPI.getProducts()
    setProducts(response.data.products)
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    setLoading(false)
  }
}
```

### 3. ProductCard Component

**Purpose**: Display individual product information

**Props**:
```jsx
<ProductCard 
  product={{
    id: 1,
    product_name: "iPhone 13 Pro",
    current_price: 79999,
    original_price: 99999,
    stock_status: "in_stock",
    rating: 4.5,
    discount: 20
  }}
  onEdit={() => {}}
  onDelete={() => {}}
/>
```

### 4. PriceChart Component

**Purpose**: Visualize price trends

**Uses Recharts**:
```jsx
import { LineChart, Line, XAxis, YAxis } from 'recharts'

const PriceChart = ({ productId }) => {
  const [data, setData] = useState([])

  useEffect(() => {
    productAPI.getPriceHistory(productId)
      .then(res => setData(res.data))
  }, [productId])

  return (
    <LineChart width={500} height={300} data={data}>
      <XAxis dataKey="date" />
      <YAxis />
      <Line type="monotone" dataKey="price" stroke="#00d4ff" />
    </LineChart>
  )
}
```

### 5. AlertSettings Component

**Purpose**: Manage price alerts

**Features**:
- Set price thresholds
- Choose notification methods (email/SMS)
- Enable/disable alerts
- View alert history

---

## Authentication Flow

### Login Flow:
```
1. User enters email/password
2. Frontend calls authAPI.login()
3. Backend returns JWT token
4. Frontend stores token in localStorage
5. AuthContext updates user state
6. App redirects to Dashboard
```

### Protected Routes:
```jsx
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  
  if (!user) {
    return <Navigate to="/login" />
  }
  
  return children
}

// Usage
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/" element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } />
</Routes>
```

---

## API Integration

All API calls use the pre-configured `api.js` service:

```javascript
// Authentication
import { authAPI, productAPI, alertAPI } from '../services/api'

await authAPI.register(userData)
await authAPI.login(credentials)
await authAPI.getProfile()

// Products
await productAPI.addProduct(productData)
await productAPI.getProducts()
await productAPI.getProductById(id)

// Alerts
await alertAPI.createAlert(alertData)
await alertAPI.getAlerts()
await alertAPI.updateAlert(id, settings)
```

---

## Styling Guide

### Dark Theme Colors:
```css
--primary-bg: #0a0e27;
--secondary-bg: #1a1f3a;
--accent: #00d4ff;
--text-primary: #e0e0e0;
--success: #10b981;
--error: #ef4444;
```

### Component Structure:
```jsx
const Component = () => {
  return (
    <div className="container"> {/* Full-width container */}
      <div className="card"> {/* Card with border & shadow */}
        <h2 className="heading">Title</h2>
        <p className="text">Content</p>
        <button className="btn btn-primary">Action</button>
      </div>
    </div>
  )
}
```

---

## Development Checklist

- [ ] Setup React project with Vite
- [ ] Install all dependencies
- [ ] Configure .env.local with API URL
- [ ] Create AuthContext for authentication
- [ ] Build Login/Register pages
- [ ] Implement protected routes
- [ ] Create Dashboard layout
- [ ] Build ProductCard component
- [ ] Add product search/filter
- [ ] Create PriceChart with Recharts
- [ ] Build AlertSettings component
- [ ] Add error handling & loading states
- [ ] Style with Tailwind CSS
- [ ] Test all features locally
- [ ] Prepare for deployment

---

## Next Steps

1. **Start Development**: Follow setup instructions above
2. **Build Components**: Create each component listed in structure
3. **Test Locally**: Run `npm run dev` and test all features
4. **Deploy**: Push to GitHub and deploy to Vercel/Netlify

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| CORS error | Backend CORS is already configured |
| 401 error | Check token in localStorage |
| 404 on API | Verify backend is running |
| CSS not applying | Clear browser cache (Ctrl+Shift+R) |
| Import error | Check file paths and extensions (.jsx) |

---

## Resources

- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev
- React Router: https://reactrouter.com
- Recharts: https://recharts.org
- Tailwind CSS: https://tailwindcss.com
