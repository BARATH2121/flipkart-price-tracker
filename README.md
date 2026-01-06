# 🛒 Flipkart Price Tracker - Price Analysis & Alert System

A full-stack web application for monitoring Flipkart product prices in real-time with intelligent price drop alerts, historical trend analysis, and interactive dashboards.

## ✨ Features

- **Real-time Price Monitoring**: Automatic hourly price scraping from Flipkart
- **Price History Tracking**: Store and visualize historical price trends
- **Smart Alerts**: Email & SMS notifications for price drops and threshold alerts
- **Interactive Dashboard**: React-based UI with live charts and product details
- **Dark Theme Design**: Modern UI with neon-blue accents and futuristic typography
- **Responsive Design**: Fully responsive for desktop and mobile devices
- **User Authentication**: Secure login and registration system
- **Customizable Alerts**: Set price thresholds and notification preferences

## 🛠️ Tech Stack

### Backend
- **Framework**: Flask/FastAPI (Python)
- **Database**: SQLite (development), PostgreSQL (production)
- **Scraping**: BeautifulSoup4, Selenium WebDriver
- **Notifications**: SMTP (Email), Twilio (SMS)
- **Task Scheduling**: Celery with Redis
- **API**: RESTful with JWT authentication

### Frontend
- **Framework**: React 18 with Vite
- **Charts**: Recharts for interactive price visualizations
- **Styling**: TailwindCSS with custom dark theme
- **State Management**: React Context API
- **HTTP Client**: Axios

### Deployment
- **Containerization**: Docker & Docker Compose
- **Hosting**: VPS/Cloud (AWS, DigitalOcean, Heroku)
- **Task Queue**: Celery for scheduled price checking

## 📁 Project Structure

```
flipkart-price-tracker/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── scrapers/
│   ├── services/
│   └── tasks/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── styles/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL/SQLite
- Docker & Docker Compose (for containerized setup)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 📝 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh JWT token

### Products
- `POST /products/add` - Add product by URL
- `GET /products` - Get user's tracked products
- `GET /products/<id>` - Get product details
- `DELETE /products/<id>` - Remove product

### Analytics
- `GET /products/<id>/price-history` - Historical price data
- `GET /products/<id>/analytics` - Price trends and statistics

### Alerts
- `POST /alerts` - Create price alert
- `GET /alerts` - Get user's alerts
- `PUT /alerts/<id>` - Update alert settings
- `DELETE /alerts/<id>` - Delete alert

## 🔧 Environment Variables

Create `.env` file in backend directory:

```
FLASK_ENV=development
DATABASE_URL=sqlite:///flipkart_tracker.db
JWT_SECRET_KEY=your-secret-key
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=your-app-password
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

## 📊 Database Schema

### Users Table
- id, username, email, password_hash, phone, created_at

### Products Table
- id, user_id, flipkart_url, product_name, current_price, stock_status, added_at

### Price History Table
- id, product_id, price, stock_status, recorded_at

### Alerts Table
- id, product_id, user_id, threshold_price, alert_type, notif_method, is_active, created_at

## 🎨 UI/UX Design

- **Color Scheme**: Dark background (#0a0e27) with neon-blue accents (#00d4ff)
- **Typography**: Modern, futuristic fonts
- **Layout**: Card-based with rounded corners (border-radius: 12px)
- **Components**: Modular React components with Tailwind classes
- **Responsiveness**: Mobile-first design approach

## 🔐 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting on API endpoints
- Secure environment variable management
- SQL injection prevention with ORM

## 📈 Performance Optimization

- Caching with Redis
- Database query optimization
- Frontend code splitting with Vite
- Lazy loading of components
- Image optimization

## 🐳 Docker Deployment

```bash
docker-compose up -d
```

## 📌 Roadmap

- [ ] Multi-product comparison
- [ ] Price prediction using ML
- [ ] Browser extension for quick price tracking
- [ ] Integration with more e-commerce sites
- [ ] Advanced analytics and reports
- [ ] Dark mode enhancement
- [ ] Mobile app (React Native)

## 👤 Author

**BARATH2121** - Computer Science Student | IoT & Full-Stack Developer

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💬 Support

For issues and questions, please create an GitHub issue in the repository.
