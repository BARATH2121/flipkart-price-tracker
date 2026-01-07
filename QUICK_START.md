# 🚀 Quick Start Guide - API Testing

## 5-Minute Setup to Test Backend API

### Step 1: Start Backend Server

**Open Terminal/Command Prompt and run:**

```bash
cd backend
python app.py
```

**Expected Output:**
```
 * Running on http://127.0.0.1:5000
 * Debug mode: off
```

✅ **Backend is now running on `http://localhost:5000`**

---

### Step 2: Choose Your Testing Tool

#### Option A: Using Postman (Recommended)

1. **Download Postman**: https://www.postman.com/downloads/
2. **Create New Request**:
   - Method: `POST`
   - URL: `http://localhost:5000/api/auth/register`
   - Body (JSON):
     ```json
     {
       "email": "test@example.com",
       "password": "Test123",
       "name": "Test User",
       "phone": "+919876543210"
     }
     ```
3. Click **Send**
4. You should see a **201 response** with user data

#### Option B: Using cURL (Quick)

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123",
    "name": "Test User",
    "phone": "+919876543210"
  }'
```

#### Option C: Using Thunder Client (VS Code)

1. Install Thunder Client extension in VS Code
2. Create New Request
3. Follow same steps as Postman

---

### Step 3: Login to Get JWT Token

**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "email": "test@example.com",
  "password": "Test123"
}
```

**Expected Response (200)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

⚠️ **COPY THE TOKEN VALUE** - You'll use this for all next requests!

---

### Step 4: Test All Endpoints

For all authenticated endpoints, add this header:
```
Authorization: Bearer YOUR_COPIED_TOKEN
```

#### A. Test Get Profile

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### B. Test Add Product

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "flipkart_url": "https://www.flipkart.com/dp/B08TEST",
    "alert_price": 5000
  }'
```

**Save the product ID from response!**

#### C. Test Get All Products

```bash
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### D. Test Create Alert

```bash
curl -X POST http://localhost:5000/api/alerts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "product_id": 1,
    "alert_type": "price_drop",
    "threshold": 4000,
    "notification_method": "email"
  }'
```

#### E. Test Get All Alerts

```bash
curl -X GET http://localhost:5000/api/alerts \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Quick Checklist

- [ ] Backend running on port 5000
- [ ] Register endpoint working (201 response)
- [ ] Login endpoint working and returns token
- [ ] Get profile endpoint working (200 response)
- [ ] Add product endpoint working (201 response)
- [ ] Get products endpoint returning list
- [ ] Create alert endpoint working (201 response)
- [ ] Get alerts endpoint returning list

✅ **If all tests passed, your backend API is fully functional!**

---

## Troubleshooting

### Error: "Connection refused"
**Solution**: Make sure backend is running (`python app.py`)

### Error: "Invalid token"
**Solution**: Check token was copied correctly from login response

### Error: 404 Not Found
**Solution**: Make sure endpoint URL is correct (check capitalization)

### Error: "Missing required fields"
**Solution**: Verify all required JSON fields are present in request body

---

## Next Steps

Once backend testing is complete:

1. **Read API Documentation**: Open `API_INTEGRATION.md` for complete endpoint reference
2. **Detailed Testing**: Follow `API_TESTING.md` for comprehensive test suite
3. **Build Frontend**: Use the tested API with your React frontend
4. **Frontend Integration**: See `frontend/src/services/api.js` for ready-to-use API client

---

## Success!

If you reached this point and all endpoints are working, congratulations! 🎉

Your backend is production-ready for frontend integration.
