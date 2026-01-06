# Development Guide - Flipkart Price Tracker

This guide provides step-by-step instructions for setting up and developing the Flipkart Price Tracker application.

## Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL or SQLite
- Git
- Redis (for Celery task queue)
- Twilio Account (for SMS notifications)
- Gmail Account (for Email notifications)

## Backend Setup

### 1. Clone and Navigate to Backend

```bash
git clone https://github.com/BARATH2121/flipkart-price-tracker.git
cd flipkart-price-tracker/backend
```

### 2. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

```bash
cp .env.example .env
# Edit .env and add your credentials
```

### 5. Initialize Database

```bash
python
from app import app, db
with app.app_context():
    db.create_all()
exit()
```

### 6. Run Flask Server

```bash
python app.py
```

The API will be available at `http://localhost:5000`

## Frontend Setup

### 1. Navigate to Frontend

```bash
cd ../frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create `.env.local`:

```
VITE_API_URL=http://localhost:5000/api
```

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Key Implementation Areas

### Backend Architecture

1. **Database Models** (`models/`)
   - User: Authentication and profile
   - Product: Flipkart product URLs and details
   - PriceHistory: Historical price records
   - Alert: User alert configurations

2. **Scrapers** (`scrapers/`)
   - Flipkart scraper using Selenium/BeautifulSoup
   - Extract: Product name, price, stock status
   - Handle dynamic content loading

3. **Services** (`services/`)
   - Notification Service: Email & SMS
   - Price Analysis: Trend calculations
   - User Service: Authentication logic

4. **Routes** (`routes/`)
   - Auth: Login, Register, JWT tokens
   - Products: CRUD operations
   - Alerts: Alert management

### Frontend Components

1. **Dashboard** - Main product tracking interface
2. **ProductCard** - Individual product display
3. **PriceChart** - Recharts for price trends
4. **AlertSettings** - User notification preferences
5. **Authentication** - Login/Register pages

## Database Schema

### Users Table
```sql
id, username, email, password_hash, phone, created_at
```

### Products Table
```sql
id, user_id, flipkart_url, product_name, current_price, stock_status, added_at
```

### Price History Table
```sql
id, product_id, price, stock_status, recorded_at
```

### Alerts Table
```sql
id, product_id, user_id, threshold_price, alert_type, notif_method, is_active, created_at
```

## API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token

### Products
- `POST /api/products` - Add product
- `GET /api/products` - Get all products
- `GET /api/products/<id>` - Get product details
- `DELETE /api/products/<id>` - Remove product

### Price History
- `GET /api/products/<id>/history` - Get price history
- `GET /api/products/<id>/analytics` - Get analytics

### Alerts
- `POST /api/alerts` - Create alert
- `GET /api/alerts` - Get user alerts
- `PUT /api/alerts/<id>` - Update alert
- `DELETE /api/alerts/<id>` - Delete alert

## UI/UX Design System

### Color Palette
- Background: `#0a0e27` (Dark Navy)
- Accent: `#00d4ff` (Neon Blue)
- Text: `#ffffff` (White)
- Secondary: `#1a1f3a` (Darker Blue)

### Component Styling
- Card border-radius: `12px`
- Box shadow: `0 8px 16px rgba(0, 212, 255, 0.1)`
- Font family: Modern sans-serif (Poppins/Inter)

## Testing

### Backend Tests
```bash
pytest tests/
```

### Frontend Tests
```bash
npm test
```

## Deployment

### Docker Setup
```bash
docker-compose up -d
```

### Production Checklist
- [ ] Set `FLASK_ENV=production`
- [ ] Enable HTTPS
- [ ] Configure PostgreSQL
- [ ] Set up Redis
- [ ] Configure Celery tasks
- [ ] Set up monitoring
- [ ] Configure backups

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check DATABASE_URL in .env
   - Ensure PostgreSQL is running

2. **Scraping Fails**
   - Verify Selenium/ChromeDriver setup
   - Check Flipkart website structure
   - Update selectors if website changes

3. **Email Not Sending**
   - Verify SMTP credentials
   - Enable "Less secure apps" for Gmail
   - Check spam folder

4. **SMS Not Sending**
   - Verify Twilio account balance
   - Check phone number format
   - Verify API credentials

## Contributing

1. Create a new branch for features
2. Follow PEP8 for Python
3. Follow ESLint rules for JavaScript
4. Write tests for new features
5. Submit pull request with description

## Learning Resources

- Flask Documentation: https://flask.palletsprojects.com/
- React Documentation: https://react.dev/
- Recharts: https://recharts.org/
- TailwindCSS: https://tailwindcss.com/
- Selenium: https://www.selenium.dev/

## Support

For issues and questions, create a GitHub issue or contact the development team.

---

**Last Updated**: January 2026
**Version**: 1.0.0
