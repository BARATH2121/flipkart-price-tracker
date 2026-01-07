# 🔧 Backend Troubleshooting Guide

## Issue: "Resource not found" Error on /api/auth/register

### Status
Your backend **IS running** and responding to requests! ✅

The error means the route `/api/auth/register` is not being found, which suggests:
1. Routes are not properly registered in the Flask app
2. The app.py file may not be importing the route blueprints

---

## Quick Fix

### Step 1: Check if routes are being imported in app.py

Your `backend/app.py` should have these imports:

```python
from auth_routes import auth_bp
from product_routes import product_bp
from alert_routes import alert_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(product_bp, url_prefix='/api')
app.register_blueprint(alert_bp, url_prefix='/api')
```

### Step 2: Verify file structure

Your backend folder should have:
```
backend/
├── app.py
├── models.py
├── auth_routes.py
├── product_routes.py
├── alert_routes.py
├── notification_service.py
├── flipkart_scraper.py
├── requirements.txt
└── .env.example
```

### Step 3: Check auth_routes.py

It should start with:

```python
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    # Your registration logic here
    data = request.get_json()
    # ...
```

---

## Correct PowerShell Test Command

Once routes are fixed, use this exact PowerShell command:

```powershell
$body = @{
    email = "test@example.com"
    password = "Test123"
    name = "Test User"
    phone = "+919876543210"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body `
    -SkipHttpErrorCheck

$response.Content | ConvertFrom-Json | Format-Custom
```

---

## Expected Success Response (201 Created)

```json
{
  "id": 1,
  "email": "test@example.com",
  "name": "Test User",
  "phone": "+919876543210"
}
```

---

## Debugging Steps

### 1. Check Backend Logs

When you run `python app.py`, look for:
- ✅ All routes should be printed when app starts
- ❌ If routes are missing, blueprints aren't registered

Expected output:
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

### 2. Test a Known Endpoint

Try accessing the health check (if exists):
```powershell
curl http://localhost:5000/
# Or
curl http://localhost:5000/api/health
```

### 3. Check for Import Errors

Look at the terminal where you ran `python app.py`:
- Any `ModuleNotFoundError` or `ImportError`?
- Any `SyntaxError` in the route files?

If there's an error, the app might be running but routes aren't loaded.

---

## Complete Working Example - auth_routes.py

```python
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate input
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Check if user exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({"error": "User already exists"}), 409
        
        # Create user
        hashed_password = generate_password_hash(data['password'])
        user = User(
            email=data['email'],
            password=hashed_password,
            name=data.get('name', ''),
            phone=data.get('phone', '')
        )
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "phone": user.phone
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({"error": "Missing credentials"}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not check_password_hash(user.password, data['password']):
            return jsonify({"error": "Invalid credentials"}), 401
        
        # Create JWT token (requires Flask-JWT-Extended)
        from flask_jwt_extended import create_access_token
        token = create_access_token(identity=user.id)
        
        return jsonify({
            "token": token,
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
```

---

## Next Steps

1. **Verify app.py** - Check that all blueprints are imported and registered
2. **Restart backend** - Stop the server (Ctrl+C) and run `python app.py` again
3. **Test registration** - Use the PowerShell command above
4. **Check response** - You should get a 201 with user data

---

## Common Causes

| Issue | Solution |
|-------|----------|
| 404 on all /api routes | Blueprints not registered in app.py |
| ModuleNotFoundError | Missing file or import path incorrect |
| SyntaxError | Check Python syntax in route files |
| 500 Server Error | Database not initialized or model issue |
| Connection refused | Backend not running on port 5000 |

---

## Still Stuck?

Share the output from your `python app.py` startup - that will show us exactly what's being registered!
