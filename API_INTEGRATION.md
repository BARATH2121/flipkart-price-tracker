# 📡 Backend API Integration Guide

## Overview
Complete integration guide for the Flipkart Price Tracker backend API. All 16 endpoints documented with request/response examples.

## Backend Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints (except auth) require JWT Bearer token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 1. Authentication Endpoints

### 1.1 Register User
**Endpoint**: `POST /auth/register`

**Request**:
```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "name": "John Doe",
  "phone": "+919876543210"
}
```

**Response (200)**:
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "+919876543210",
  "created_at": "2026-01-07T20:00:00Z"
}
```

---

### 1.2 Login User
**Endpoint**: `POST /auth/login`

**Request**:
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response (200)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

### 1.3 Get User Profile
**Endpoint**: `GET /auth/profile`

**Headers**: Requires JWT token

**Response (200)**:
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "+919876543210",
  "notification_email": "user@example.com",
  "notification_sms": "+919876543210",
  "created_at": "2026-01-07T20:00:00Z",
  "updated_at": "2026-01-07T20:00:00Z"
}
```

---

### 1.4 Update User Profile
**Endpoint**: `PUT /auth/profile`

**Headers**: Requires JWT token

**Request**:
```json
{
  "name": "John Updated",
  "phone": "+918765432109",
  "notification_email": "newemail@example.com",
  "notification_sms": "+918765432109"
}
```

**Response (200)**:
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Updated",
  "updated_at": "2026-01-07T20:30:00Z"
}
```

---

### 1.5 Logout User
**Endpoint**: `POST /auth/logout`

**Headers**: Requires JWT token

**Response (200)**:
```json
{
  "message": "Logged out successfully"
}
```

---

## 2. Product Endpoints

### 2.1 Add Product
**Endpoint**: `POST /products`

**Headers**: Requires JWT token

**Request**:
```json
{
  "flipkart_url": "https://www.flipkart.com/dp/B08PRODUCT",
  "alert_price": 5000
}
```

**Response (201)**:
```json
{
  "id": 1,
  "user_id": 1,
  "flipkart_url": "https://www.flipkart.com/dp/B08PRODUCT",
  "product_name": "iPhone 13 Pro",
  "current_price": 79999,
  "stock_status": "in_stock",
  "rating": 4.5,
  "reviews_count": 1200,
  "alert_price": 5000,
  "created_at": "2026-01-07T20:00:00Z"
}
```

---

### 2.2 Get All Products
**Endpoint**: `GET /products`

**Headers**: Requires JWT token

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response (200)**:
```json
{
  "products": [
    {
      "id": 1,
      "product_name": "iPhone 13 Pro",
      "current_price": 79999,
      "stock_status": "in_stock",
      "rating": 4.5
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

---

### 2.3 Get Product Details
**Endpoint**: `GET /products/{product_id}`

**Headers**: Requires JWT token

**Response (200)**:
```json
{
  "id": 1,
  "product_name": "iPhone 13 Pro",
  "flipkart_url": "https://www.flipkart.com/dp/B08PRODUCT",
  "current_price": 79999,
  "original_price": 99999,
  "discount": 20,
  "stock_status": "in_stock",
  "rating": 4.5,
  "reviews_count": 1200,
  "alert_price": 5000,
  "price_history": [
    {
      "price": 79999,
      "timestamp": "2026-01-07T20:00:00Z"
    }
  ]
}
```

---

### 2.4 Delete Product
**Endpoint**: `DELETE /products/{product_id}`

**Headers**: Requires JWT token

**Response (200)**:
```json
{
  "message": "Product deleted successfully"
}
```

---

## 3. Alert Endpoints

### 3.1 Create Alert
**Endpoint**: `POST /alerts`

**Headers**: Requires JWT token

**Request**:
```json
{
  "product_id": 1,
  "alert_type": "price_drop",
  "threshold": 5000,
  "notification_method": "email"
}
```

**Response (201)**:
```json
{
  "id": 1,
  "product_id": 1,
  "alert_type": "price_drop",
  "threshold": 5000,
  "notification_method": "email",
  "is_active": true,
  "created_at": "2026-01-07T20:00:00Z"
}
```

---

### 3.2 Get All Alerts
**Endpoint**: `GET /alerts`

**Headers**: Requires JWT token

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `active`: Filter by active status (true/false)

**Response (200)**:
```json
{
  "alerts": [
    {
      "id": 1,
      "product_id": 1,
      "alert_type": "price_drop",
      "threshold": 5000,
      "is_active": true
    }
  ],
  "total": 1,
  "page": 1
}
```

---

### 3.3 Get Alert Details
**Endpoint**: `GET /alerts/{alert_id}`

**Headers**: Requires JWT token

**Response (200)**:
```json
{
  "id": 1,
  "product_id": 1,
  "product": {
    "product_name": "iPhone 13 Pro",
    "current_price": 79999
  },
  "alert_type": "price_drop",
  "threshold": 5000,
  "notification_method": "email",
  "is_active": true,
  "created_at": "2026-01-07T20:00:00Z"
}
```

---

### 3.4 Update Alert
**Endpoint**: `PUT /alerts/{alert_id}`

**Headers**: Requires JWT token

**Request**:
```json
{
  "threshold": 4500,
  "is_active": true,
  "notification_method": "sms"
}
```

**Response (200)**:
```json
{
  "id": 1,
  "threshold": 4500,
  "notification_method": "sms",
  "updated_at": "2026-01-07T20:30:00Z"
}
```

---

### 3.5 Delete Alert
**Endpoint**: `DELETE /alerts/{alert_id}`

**Headers**: Requires JWT token

**Response (200)**:
```json
{
  "message": "Alert deleted successfully"
}
```

---

### 3.6 Get Product Alerts
**Endpoint**: `GET /alerts/product/{product_id}`

**Headers**: Requires JWT token

**Response (200)**:
```json
{
  "alerts": [
    {
      "id": 1,
      "alert_type": "price_drop",
      "threshold": 5000,
      "is_active": true
    }
  ]
}
```

---

## Frontend API Service (api.js)

The frontend has a centralized API service for all backend interactions:

```javascript
// Authentication
import { authAPI } from './services/api'
await authAPI.register(userData)
await authAPI.login(credentials)
await authAPI.logout()

// Products
import { productAPI } from './services/api'
await productAPI.addProduct(productData)
await productAPI.getProducts(params)
await productAPI.getProductById(id)
await productAPI.deleteProduct(id)

// Alerts
import { alertAPI } from './services/api'
await alertAPI.createAlert(alertData)
await alertAPI.getAlerts(params)
await alertAPI.updateAlert(id, alertData)
await alertAPI.deleteAlert(id)
```

---

## Error Handling

All errors return JSON response with status code and message:

```json
{
  "error": "Invalid credentials",
  "status": 401
}
```

Common HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Server Error

---

## Environment Variables

Set in `.env` file in frontend root:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Integration Checklist

- [ ] Backend running on port 5000
- [ ] Database configured (PostgreSQL/SQLite)
- [ ] JWT secret configured
- [ ] Frontend .env configured with correct API URL
- [ ] CORS enabled on backend
- [ ] Email service configured (Sendgrid/SMTP)
- [ ] SMS service configured (Twilio)
- [ ] Test all endpoints with Postman/Insomnia

---

## Testing API Endpoints

### Using cURL:
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass"}'

# Get Products (requires token)
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman:
1. Import backend API endpoints
2. Set `Bearer token` in Authorization tab
3. Test each endpoint
4. Save responses for documentation

---

Last Updated: January 7, 2026
Version: 1.0
