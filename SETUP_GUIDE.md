# Traffix - Traffic Management System
## Setup and Troubleshooting Guide

### Issues Found & Fixed

#### 1. **Backend Python Dependencies** ✅
- **Issue**: FastAPI and Uvicorn were not installed
- **Fix**: Installed all dependencies from `requirements.txt`
- **Command**: `python -m pip install -r backend/requirements.txt`

#### 2. **Frontend Build System** ✅
- **Status**: Building successfully with Next.js 16.1.6
- **Dependencies**: All installed and working correctly
- **Build Command**: `npm run build`

#### 3. **Multiple package-lock.json Files** ⚠️
- **Warning**: System detected multiple lock files (root and frontend)
- **Impact**: Minor - Next.js warns about inferred workspace root
- **Solution**: Keep frontend's own package.json as is for independence

#### 4. **Root package.json Structure** ✅
- **Fixed**: Added proper metadata, scripts, and description
- **Added**: Convenient npm scripts for development

---

## Quick Start

### Option 1: Using Batch Files (Windows)
1. **Start Backend**: Double-click `START_SERVER.bat`
   - Backend will run on `http://localhost:8000`
   
2. **Start Frontend**: Double-click `START_FRONTEND.bat` (in another terminal)
   - Frontend will run on `http://localhost:3000`

### Option 2: Using Terminal Commands
#### Terminal 1 - Backend:
```bash
cd backend
python main.py
```
Backend runs on: **http://localhost:8000**

#### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```
Frontend runs on: **http://localhost:3000**

---

## Testing the API

### Login Endpoints (POST)
```
POST http://localhost:8000/api/auth/login
{
  "username": "admin",
  "password": "admin"
}
```

**Available Test Credentials:**
- Admin: `username: admin, password: admin` → Role: Super Admin
- Engineer: `username: engineer, password: engineer` → Role: Traffic Engineer
- Operator: `username: operator, password: operator` → Role: Traffic Operator
- Emergency: `username: emergency, password: emergency` → Role: Emergency Authority

### Traffic Junction Endpoints (GET)
- Get all junctions: `GET http://localhost:8000/api/junctions`
- Junction traffic: `GET http://localhost:8000/api/junction/{id}/traffic`
- Junction history: `GET http://localhost:8000/api/junction/{id}/history`
- Predictions: `GET http://localhost:8000/api/junction/{id}/prediction`

### Control Endpoints (POST)
- Signal control: `POST http://localhost:8000/api/signal/control`
- Get events: `GET http://localhost:8000/api/events`

---

## System Architecture

### Backend Stack
- **Framework**: FastAPI (Python)
- **Server**: Uvicorn
- **Security**: python-jose, passlib, bcrypt
- **Database**: SQLAlchemy (configured but not active)
- **WebSocket**: websockets library

### Frontend Stack
- **Framework**: Next.js 16.1.6
- **Runtime**: React 19.2.3
- **UI Components**: Lucide React
- **Maps**: Leaflet + React-Leaflet
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5

---

## Environment Setup (Already Completed)

### Python Environment
- Python 3.10+
- Virtual environment: `myenv/`
- All packages installed from `backend/requirements.txt`

### Node.js Environment
- Node.js 18+
- Frontend: `frontend/node_modules/`
- All npm dependencies installed

---

## Troubleshooting

### Backend Won't Start
1. **Check Python installation:**
   ```bash
   python --version
   ```

2. **Verify FastAPI is installed:**
   ```bash
   python -m pip list | findstr fastapi
   ```

3. **Reinstall dependencies:**
   ```bash
   python -m pip install -r backend/requirements.txt
   ```

4. **Check port 8000 usage:**
   ```bash
   netstat -ano | findstr 8000
   ```

### Frontend Won't Start
1. **Clear cache and reinstall:**
   ```bash
   cd frontend
   rm -r node_modules .next
   npm install
   ```

2. **Check Node.js version:**
   ```bash
   node --version
   ```

3. **Port 3000 in use:**
   ```bash
   npm run dev -- -p 3000
   ```

### CORS Issues
The backend is configured with CORS middleware to allow requests from any origin:
```python
allow_origins=["*"]
allow_methods=["*"]
allow_headers=["*"]
```

---

## Build Commands

### Production Build
```bash
cd frontend
npm run build
npm start
```

### Backend Production
```bash
cd backend
python main.py
```

---

## Performance Notes
- Frontend build takes ~10 seconds
- Hot reload enabled for development
- Real-time traffic updates via 10-second refresh interval
- Leaflet map with custom icon rendering

---

## Next Steps
1. Configure database credentials in `backend/main.py` if using PostgreSQL
2. Add proper authentication tokens (currently dummy tokens)
3. Implement real traffic data connector
4. Deploy to production environment

---

**Last Updated**: March 4, 2026
**Status**: ✅ All critical issues resolved
