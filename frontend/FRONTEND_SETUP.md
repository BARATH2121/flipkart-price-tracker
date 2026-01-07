# 🎨 Frontend Setup Guide - Flipkart Price Tracker

## Quick Start

### 1. Navigate to Frontend Directory

```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── ProductCard.jsx
│   │   ├── PriceChart.jsx
│   │   ├── AlertSettings.jsx
│   │   ├── Navbar.jsx
│   │   └── LoadingSpinner.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   └── Settings.jsx
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── public/
│   └── favicon.ico
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Design System

### Color Palette
- **Background**: #0a0e27 (Dark Navy)
- **Accent**: #00d4ff (Neon Blue)
- **Text**: #ffffff (White)
- **Secondary**: #1a1f3a (Dark Blue)
- **Success**: #00ff88 (Green)
- **Error**: #ff3333 (Red)

### Component Examples

#### Dashboard Card (Dark Theme)
```jsx
<div className="bg-slate-900 border border-cyan-500 rounded-lg p-6 shadow-lg hover:shadow-cyan-500/50">
  {/* content */}
</div>
```

#### Neon Button
```jsx
<button className="bg-cyan-500 text-slate-900 font-bold px-6 py-2 rounded-lg hover:bg-cyan-400 shadow-lg shadow-cyan-500/50">
  Click Me
</button>
```

## TailwindCSS Dark Theme Setup

### tailwind.config.js

```javascript
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        neon: '#00d4ff',
        darkBg: '#0a0e27',
        darkCard: '#1a1f3a',
      },
      boxShadow: {
        neon: '0 0 10px rgba(0, 212, 255, 0.3)',
        'neon-lg': '0 0 30px rgba(0, 212, 255, 0.5)',
      }
    },
  },
  plugins: [],
}
```

## Available npm Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Key Components to Build

### 1. Dashboard Component
- Display tracked products
- Show price history charts
- Quick stats (total products, price drops)
- Add new product button

### 2. Product Card
- Product image
- Current price with trend
- Stock status badge
- Alert toggle
- Delete button

### 3. Price Chart (Recharts)
```jsx
import { LineChart, Line, XAxis, YAxis } from 'recharts';

<LineChart data={priceData}>
  <Line type="monotone" dataKey="price" stroke="#00d4ff" />
</LineChart>
```

### 4. Alert Settings
- Price threshold input
- Alert type selector (email/SMS/both)
- Frequency selector
- Enable/disable toggle

## API Integration with Axios

### services/api.js

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = (email, password) =>
  api.post('/auth/login', { email, password });

export const getProducts = () => api.get('/products');

export const addProduct = (url) =>
  api.post('/products', { flipkart_url: url });

export const getAlerts = () => api.get('/alerts');

export const createAlert = (alert) =>
  api.post('/alerts', alert);

export default api;
```

## Authentication Flow

1. **Login Page** - Get JWT token
2. **Store Token** - Save in localStorage
3. **Protected Routes** - Redirect if no token
4. **API Calls** - Attach token to headers
5. **Logout** - Clear token from storage

## Responsive Design

- **Mobile**: Single column layout
- **Tablet**: Two column layout
- **Desktop**: Three+ column layout

Use TailwindCSS breakpoints:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

## Performance Optimization

- Lazy load components with React.lazy()
- Memoize expensive components
- Debounce API calls
- Cache API responses

## Deployment

```bash
npm run build
# Serves dist/ folder on production
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

---

**Status**: Frontend setup initialized
**Next**: Build components and integrate APIs
