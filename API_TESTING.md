# 🧪 API Testing Guide

## Prerequisites

1. **Backend Running**: Ensure Flask backend is running on `http://localhost:5000`
   ```bash
   cd backend
   python app.py
   ```

2. **Testing Tools** (Choose One):
   - **Postman**: [Download here](https://www.postman.com/downloads/)
   - **Insomnia**: [Download here](https://insomnia.rest/download)
   - **Thunder Client** (VS Code): Install from extensions
   - **cURL**: Built-in on Linux/Mac/WSL

3. **Environment Setup**:
   - Base URL: `http://localhost:5000/api`
   - Content-Type: `application/json`

---

## Testing Flow

### Phase 1: Authentication Tests

#### 1.1 Register User
**Endpoint**: `POST /auth/register`

**Request**:
```json
{
  "email": "testuser@example.com",
  "password": "TestPassword123",
  "name": "Test User",
  "phone": "+919876543210"
}
```

**Expected Response** (201):
```json
{
  "id": 1,
  "email": "testuser@example.com",
  "name": "Test User",
  "phone": "+919876543210"
}
```

**cURL**:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "TestPassword123",
    "name": "Test User",
    "phone": "+919876543210"
  }'
```

---

#### 1.2 Login User
**Endpoint**: `POST /auth/login`

**Request**:
```json
{
  "email": "testuser@example.com",
  "password": "TestPassword123"
}
```

**Expected Response** (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "testuser@example.com",
    "name": "Test User"
  }
}
```

⚠️ **SAVE THIS TOKEN** - You'll need it for all subsequent requests!

**cURL**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "TestPassword123"
  }'
```

---

#### 1.3 Get User Profile
**Endpoint**: `GET /auth/profile`
**Headers**: `Authorization: Bearer YOUR_TOKEN`

**Expected Response** (200):
```json
{
  "id": 1,
  "email": "testuser@example.com",
  "name": "Test User",
  "phone": "+919876543210",
  "notification_email": "testuser@example.com",
  "notification_sms": "+919876543210"
}
```

**cURL**:
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

#### 1.4 Update User Profile
**Endpoint**: `PUT /auth/profile`
**Headers**: `Authorization: Bearer YOUR_TOKEN`

**Request**:
```json
{
  "name": "Updated Name",
  "phone": "+918765432109"
}
```

**Expected Response** (200):
```json
{
  "id": 1,
  "name": "Updated Name",
  "phone": "+918765432109"
}
```

---

### Phase 2: Product Tests

#### 2.1 Add Product
**Endpoint**: `POST /products`
**Headers**: `Authorization: Bearer YOUR_TOKEN`

**Request**:
```json
{
  "flipkart_url": "https://www.flipkart.com/dp/B08PRODUCT",
  "alert_price": 5000
}
```

**Expected Response** (201):
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
  "alert_price": 5000
}
```

**Save the product ID for next tests!**

---

#### 2.2 Get All Products
**Endpoint**: `GET /products`
**Headers**: `Authorization: Bearer YOUR_TOKEN`
**Query Params** (Optional): `?page=1&limit=10`

**Expected Response** (200):
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

**cURL**:
```bash
curl -X GET "http://localhost:5000/api/products?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

#### 2.3 Get Product Details
**Endpoint**: `GET /products/{product_id}`
**Headers**: `Authorization: Bearer YOUR_TOKEN`

**Expected Response** (200):
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

### Phase 3: Alert Tests

#### 3.1 Create Alert
**Endpoint**: `POST /alerts`
**Headers**: `Authorization: Bearer YOUR_TOKEN`

**Request**:
```json
{
  "product_id": 1,
  "alert_type": "price_drop",
  "threshold": 5000,
  "notification_method": "email"
}
```

**Expected Response** (201):
```json
{
  "id": 1,
  "product_id": 1,
  "alert_type": "price_drop",
  "threshold": 5000,
  "notification_method": "email",
  "is_active": true
}
```

**Save the alert ID for next tests!**

---

#### 3.2 Get All Alerts
**Endpoint**: `GET /alerts`
**Headers**: `Authorization: Bearer YOUR_TOKEN`

**Expected Response** (200):
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

#### 3.3 Get Alert Details
**Endpoint**: `GET /alerts/{alert_id}`
**Headers**: `Authorization: Bearer YOUR_TOKEN`

**Expected Response** (200):
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
  "is_active": true
}
```

---

#### 3.4 Update Alert
**Endpoint**: `PUT /alerts/{alert_id}`
**Headers**: `Authorization: Bearer YOUR_TOKEN`

**Request**:
```json
{
  "threshold": 4500,
  "is_active": true
}
```

**Expected Response** (200):
```json
{
  "id": 1,
  "threshold": 4500,
  "is_active": true
}
```

---

#### 3.5 Get Product Alerts
**Endpoint**: `GET /alerts/product/{product_id}`
**Headers**: `Authorization: Bearer YOUR_TOKEN`

**Expected Response** (200):
```json
{
  "alerts": [
    {
      "id": 1,
      "alert_type": "price_drop",
      "threshold": 4500,
      "is_active": true
    }
  ]
}
```

---

### Phase 4: Cleanup Tests

#### 4.1 Delete Alert
**Endpoint**: `DELETE /alerts/{alert_id}`
**Headers**: `Authorization: Bearer YOUR_TOKEN`

**Expected Response** (200):
```json
{
  "message": "Alert deleted successfully"
}
```

---

#### 4.2 Delete Product
**Endpoint**: `DELETE /products/{product_id}`
**Headers**: `Authorization: Bearer YOUR_TOKEN`

**Expected Response** (200):
```json
{
  "message": "Product deleted successfully"
}
```

---

## Error Response Examples

### 400 Bad Request
```json
{
  "error": "Missing required fields",
  "status": 400
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid or expired token",
  "status": 401
}
```

### 404 Not Found
```json
{
  "error": "Product not found",
  "status": 404
}
```

---

## Using Postman

1. **Create Collection**: "Flipkart Price Tracker"
2. **Set Base URL Variable**:
   - Click "Environments" → "New"
   - Add variable: `base_url` = `http://localhost:5000/api`
3. **Create Folders**: Auth, Products, Alerts
4. **For Each Endpoint**:
   - Set URL: `{{base_url}}/auth/register`
   - Set Headers: `Content-Type: application/json`
   - Add body (for POST/PUT)
   - Click Send

### Store Token in Postman

1. In Login request, click **Tests** tab
2. Add:
   ```javascript
   pm.environment.set("token", pm.response.json().token);
   ```
3. In subsequent requests, use header:
   ```
   Authorization: Bearer {{token}}
   ```

---

## Testing Checklist

- [ ] Register new user
- [ ] Login user
- [ ] Get user profile
- [ ] Update user profile
- [ ] Add product
- [ ] Get all products
- [ ] Get product details
- [ ] Create alert
- [ ] Get all alerts
- [ ] Get alert details
- [ ] Update alert
- [ ] Get product alerts
- [ ] Delete alert
- [ ] Delete product
- [ ] Verify token expiry handling
- [ ] Test invalid credentials
- [ ] Test missing required fields

---

## Common Issues & Solutions

### Issue: "Connection refused"
**Solution**: Ensure backend is running on port 5000
```bash
cd backend && python app.py
```

### Issue: "Invalid token"
**Solution**: Make sure you copied the token correctly from login response

### Issue: "CORS error"
**Solution**: Backend CORS is already configured. If you get CORS error, check:
- Backend is running
- You're using correct base URL
- Content-Type header is set

### Issue: "Field cannot be null"
**Solution**: Check request JSON - ensure all required fields are present

---

## Success Criteria

✅ All endpoints return 2xx status codes for valid requests
✅ Invalid requests return appropriate 4xx error codes
✅ JWT token properly authenticates requests
✅ CRUD operations work correctly
✅ Database persists data across requests

Once all tests pass, your backend is ready for frontend integration!
