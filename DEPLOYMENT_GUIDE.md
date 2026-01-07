# Flipkart Price Tracker - Deployment Guide

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js v14+ (Download from https://nodejs.org/)
- npm v6+
- Git

### Clone & Setup

```bash
# Clone repository
git clone https://github.com/BARATH2121/flipkart-price-tracker.git
cd flipkart-price-tracker

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

---

## 📦 Build for Production

### Frontend Build

```bash
cd frontend

# Install dependencies (if not already done)
npm install

# Build for production
npm run build

# Output: dist/ folder with optimized build
```

### Build Output
The `dist/` folder contains:
- Minified HTML, CSS, and JavaScript
- Optimized images and assets
- Source maps for debugging (optional)

---

## ☁️ Deployment Options

### Option 1: Vercel (Recommended for React Apps)

1. **Sign up at Vercel**: https://vercel.com/
2. **Connect GitHub repository**
3. **Configure build settings**:
   - Build command: `npm run build` (in frontend directory)
   - Output directory: `frontend/dist`
   - Root directory: `frontend`
4. **Deploy**: Vercel auto-deploys on push

### Option 2: Netlify

1. **Sign up at Netlify**: https://netlify.com/
2. **Connect GitHub**
3. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
   - Base directory: `frontend`
4. **Deploy**: One-click deployment

### Option 3: AWS S3 + CloudFront

```bash
# Build
cd frontend
npm run build

# Deploy to S3
aws s3 sync dist/ s3://your-bucket-name/ --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Option 4: Docker + Any Cloud

**Create Dockerfile**:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build & Deploy**:
```bash
docker build -t flipkart-price-tracker .
docker run -p 80:80 flipkart-price-tracker
```

---

## 🔧 Environment Variables

Create `.env` file in `frontend/`:

```env
VITE_API_URL=https://your-backend-api.com
VITE_BACKEND_PORT=5000
```

---

## ✅ Pre-Deployment Checklist

- [ ] All dependencies installed: `npm install`
- [ ] Build runs without errors: `npm run build`
- [ ] No console errors in dev: `npm run dev`
- [ ] Environment variables configured
- [ ] API endpoints configured correctly
- [ ] Tests pass (if applicable): `npm run test`
- [ ] Bundle size acceptable (< 500KB)

---

## 📊 Performance Optimization

### Check Bundle Size
```bash
npm run build --report
```

### Optimize Images
- Use WebP format where possible
- Compress PNG/JPG files
- Use lazy loading for images

### Caching Strategies
- Set cache headers in deployment configuration
- Use service workers for offline support
- Cache assets with hash-based filenames

---

## 🐛 Troubleshooting

### Issue: Build fails with JSX error
**Solution**: Ensure all JSX files have `.jsx` extension
```bash
find . -name "*.js" -exec grep -l "<.*>" {} \; # Find JSX in .js files
```

### Issue: Missing files in production
**Solution**: Run `git pull origin main` to get latest files

### Issue: CORS errors in production
**Solution**: Configure CORS headers on backend API

### Issue: Slow performance
**Solution**: 
- Enable gzip compression
- Minify assets
- Use CDN for static files
- Implement code splitting

---

## 📱 Mobile Deployment

### Progressive Web App (PWA)
1. Add manifest.json
2. Configure service worker
3. Test on mobile devices

### Native App (Optional)
- Use React Native or Expo for iOS/Android
- Or wrap web app with Capacitor/Cordova

---

## 🔒 Security Best Practices

- [ ] Use HTTPS only (auto with most platforms)
- [ ] Set secure content security policy headers
- [ ] Enable authentication for API calls
- [ ] Sanitize user inputs
- [ ] Regular security audits
- [ ] Keep dependencies updated

```bash
# Check for vulnerabilities
npm audit
npm audit fix
```

---

## 📈 Monitoring & Logging

### Setup Error Tracking
- Sentry: https://sentry.io/
- LogRocket: https://logrocket.com/
- DataDog: https://www.datadoghq.com/

### Monitor Performance
- Google PageSpeed Insights
- WebPageTest
- Lighthouse CI

---

## 🚀 CI/CD Pipeline (GitHub Actions)

**Create `.github/workflows/deploy.yml`**:
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd frontend && npm install && npm run build
      - uses: actions/upload-artifact@v2
        with:
          name: build
          path: frontend/dist
```

---

## 📞 Support & Resources

- **Documentation**: See README.md
- **GitHub Issues**: Report bugs
- **Email**: Contact for support
- **Discord Community**: Join for discussions

---

**Last Updated**: January 7, 2026
**Version**: 1.0.0
