# Mental Health Check-in App - Deployment Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Deployment Issues Encountered](#deployment-issues-encountered)
4. [Root Cause Analysis](#root-cause-analysis)
5. [Solutions Implemented](#solutions-implemented)
6. [Deployment Guide](#deployment-guide)
7. [Troubleshooting Guide](#troubleshooting-guide)
8. [Best Practices](#best-practices)
9. [Lessons Learned](#lessons-learned)

---

## Project Overview

### Application Description
A full-stack web application for daily mental health check-ins featuring:
- User authentication (JWT-based)
- Encrypted journal entries
- Mood and stress tracking
- Data visualization
- Responsive design

### Tech Stack
- **Frontend**: React, Tailwind CSS, Axios, Recharts
- **Backend**: Node.js, Express, MongoDB, JWT
- **Deployment**: Vercel (separate deployments for frontend and backend)
- **Database**: MongoDB Atlas

---

## Architecture

### Deployment Structure
```
┌─────────────────────────────────┐     ┌─────────────────────────────────┐
│       Frontend (React)          │     │       Backend (Node.js)         │
│   mental-health-checkin-app     │────▶│ mental-health-checkin-app-gxdy  │
│      .vercel.app               │     │        .vercel.app              │
└─────────────────────────────────┘     └─────────────────────────────────┘
                                                      │
                                                      ▼
                                        ┌─────────────────────────────────┐
                                        │      MongoDB Atlas              │
                                        │     (Cloud Database)            │
                                        └─────────────────────────────────┘
```

### API Structure
```
Backend Base URL: https://mental-health-checkin-app-gxdy.vercel.app
├── / (GET) - API status
├── /api
│   ├── /auth
│   │   ├── /login (POST)
│   │   └── /register (POST)
│   └── /checkins
│       ├── / (GET) - Get all check-ins
│       └── / (POST) - Create check-in
```

---

## Deployment Issues Encountered

### 1. Environment Variable Not Loading
**Issue**: `REACT_APP_API_URL` was not being injected into the React build
**Symptoms**: 
- API calls going to `/auth/login` instead of `/api/auth/login`
- `process.env.REACT_APP_API_URL` returning `undefined`

### 2. CORS Policy Violations
**Issue**: Cross-Origin Resource Sharing blocking requests between domains
**Symptoms**:
```
Access to XMLHttpRequest at 'backend-url' from origin 'frontend-url' 
has been blocked by CORS policy
```

### 3. Vercel Routing Configuration
**Issue**: Initial `vercel.json` configuration causing routing conflicts
**Symptoms**:
- 404 errors on valid routes
- JSON parsing errors in deployment

### 4. Double Slash in API URLs
**Issue**: Malformed URLs like `//api/auth/register`
**Cause**: Trailing slash in base URL combined with leading slash in route

---

## Root Cause Analysis

### Primary Issues Identified

1. **Environment Variable Injection Failure**
   - Vercel requires rebuild after adding environment variables
   - Cache can prevent new variables from being included
   - React requires `REACT_APP_` prefix for custom variables

2. **CORS Configuration Complexity**
   - Preflight requests require specific headers
   - Credentials flag requires explicit origin (not wildcard)
   - Helmet middleware can interfere with CORS

3. **Deployment Configuration**
   - Separate deployments require explicit CORS setup
   - API routes need proper path configuration
   - Build commands must be correctly specified

---

## Solutions Implemented

### 1. Environment Variable Fix

#### Vercel Dashboard Configuration
```bash
# Frontend Environment Variable
REACT_APP_API_URL = https://mental-health-checkin-app-gxdy.vercel.app/api
```

#### Force Rebuild Process
1. Delete existing environment variable
2. Re-add with all environments selected (Production, Preview, Development)
3. Redeploy with "Use existing Build Cache: No"

### 2. CORS Configuration

#### Backend Implementation
```javascript
// Comprehensive CORS setup
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://mental-health-checkin-app.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Handle preflight
app.options('*', cors(corsOptions));
```

### 3. API URL Configuration

#### Frontend API Service
```javascript
// Remove trailing slashes to prevent double slashes
const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api')
  .replace(/\/+$/, '');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});
```

### 4. Vercel Configuration

#### Backend `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.js"
    }
  ]
}
```

#### Frontend `vercel.json`
```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## Deployment Guide

### Prerequisites
- GitHub account
- Vercel account
- MongoDB Atlas account
- Node.js installed locally

### Step-by-Step Deployment

#### 1. Backend Deployment
```bash
# Prepare backend
cd mental-health-backend
npm install

# Test locally
npm run dev

# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin [your-repo-url]
git push -u origin main

# Deploy on Vercel
# 1. Import GitHub repo on Vercel
# 2. Add environment variables:
#    - MONGODB_URI
#    - JWT_SECRET
#    - ENCRYPTION_KEY
# 3. Deploy
```

#### 2. Frontend Deployment
```bash
# Prepare frontend
cd mental-health-frontend
npm install

# Test build
npm run build

# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin [your-repo-url]
git push -u origin main

# Deploy on Vercel
# 1. Import GitHub repo
# 2. Add environment variable:
#    - REACT_APP_API_URL = [your-backend-url]/api
# 3. Deploy
```

#### 3. Post-Deployment
1. Update backend CORS to include frontend URL
2. Test all endpoints
3. Monitor logs for errors

---

## Troubleshooting Guide

### Common Issues and Solutions

#### 1. Environment Variable Not Working
```javascript
// Debug in browser console
console.log(process.env.REACT_APP_API_URL);

// Solution: Force rebuild
// 1. Change variable in Vercel
// 2. Redeploy without cache
```

#### 2. CORS Errors
```javascript
// Add to backend for debugging
app.use((req, res, next) => {
  console.log('Origin:', req.headers.origin);
  console.log('Method:', req.method);
  next();
});
```

#### 3. 404 Errors on API Routes
```bash
# Test endpoints directly
curl https://your-backend.vercel.app/
curl https://your-backend.vercel.app/api
```

#### 4. Build Failures
```bash
# Check package.json for syntax errors
npx jsonlint package.json

# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
```

---

## Best Practices

### 1. Environment Variables
- Always prefix React env variables with `REACT_APP_`
- Never commit `.env` files
- Document all required variables
- Use `.env.example` files

### 2. CORS Configuration
- Be specific with allowed origins
- Don't use wildcard (*) in production
- Handle preflight requests explicitly
- Test with different browsers

### 3. Deployment
- Test builds locally first
- Use separate deployments for frontend/backend
- Monitor deployment logs
- Set up proper error tracking

### 4. Security
- Validate all inputs
- Use HTTPS only
- Implement rate limiting
- Keep dependencies updated

---

## Lessons Learned

### 1. Vercel Deployment Nuances
- Environment variables require rebuild to take effect
- Build cache can cause issues with new variables
- Separate deployments need explicit CORS configuration

### 2. React Environment Variables
- Must start with `REACT_APP_`
- Are embedded during build time, not runtime
- Require rebuild when changed

### 3. CORS Complexity
- Preflight requests need special handling
- Credentials mode requires specific origin
- Browser security is strict about CORS

### 4. Debugging Strategies
- Always check browser console first
- Test API endpoints directly
- Use logging extensively
- Verify environment variables are loaded

### 5. API URL Management
- Avoid trailing slashes in base URLs
- Use consistent URL patterns
- Consider using proxy in development

---

## Conclusion

The Mental Health Check-in app deployment revealed several common challenges in deploying full-stack applications on Vercel. The primary issues centered around environment variable injection and CORS configuration. By systematically addressing each issue and implementing proper configuration, the application was successfully deployed with separate frontend and backend services communicating securely.

Key takeaways:
- Always verify environment variables are loaded in production
- CORS requires careful configuration for cross-domain requests
- Separate deployments offer better scalability but require more setup
- Thorough testing and debugging are essential for successful deployment

This documentation serves as a reference for similar deployments and troubleshooting scenarios.
