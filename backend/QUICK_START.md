# 🚀 Backend Quick Start - AgriShield AI

Get the backend running in 60 seconds!

---

## ⚡ Super Quick Start

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run server
python app.py
```

**Done!** Backend is running at `http://localhost:5000`

---

## ✅ Verify It's Working

### Option 1: Browser
Open: `http://localhost:5000/api/health`

**Expected**:
```json
{
  "status": "healthy",
  "service": "AgriShield AI Backend",
  "version": "1.0.0"
}
```

### Option 2: Command Line
```bash
curl http://localhost:5000/api/health
```

### Option 3: Test Suite
```bash
pip install requests
python test_backend.py
```

**Expected**: ✅ All 6 tests passing

---

## 🧪 Test Endpoints

### Chat
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Kaunsi fasal best hai?","context":{"rainfall":25,"topCrop":"Bajra"}}'
```

### Risk Analysis
```bash
curl -X POST http://localhost:5000/api/risk-analysis \
  -H "Content-Type: application/json" \
  -d '{"rainfall":25,"temperature":28,"soilType":"Loamy","season":"Kharif"}'
```

### Crop Recommendations
```bash
curl -X POST http://localhost:5000/api/crop-recommendations \
  -H "Content-Type: application/json" \
  -d '{"rainfall":25,"temperature":28,"soilType":"Loamy"}'
```

---

## 🔧 Troubleshooting

### Python Not Found
```bash
# Check Python version
python --version

# Should be 3.8 or higher
# If not installed, download from python.org
```

### Port Already in Use
```bash
# Kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:5000 | xargs kill -9
```

### Dependencies Failed
```bash
# Upgrade pip
python -m pip install --upgrade pip

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

---

## 📡 Connect Frontend

### Step 1: Add to `.env` (in root folder)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Step 2: Start Frontend
```bash
# In root folder (not backend/)
npm run dev
```

### Step 3: Verify Connection
Open browser DevTools → Network tab → Look for API calls

---

## 🎯 What's Next?

1. ✅ Backend running
2. ✅ Endpoints tested
3. ⏸️ Frontend integration (optional)

See `INTEGRATION_GUIDE.md` for integration instructions.

---

## 📚 Documentation

- Full API docs: `README.md`
- Integration guide: `../INTEGRATION_GUIDE.md`
- Architecture: `../ARCHITECTURE_DIAGRAM.md`

---

**Status**: ✅ Ready  
**Port**: 5000  
**Endpoints**: 6  
**Response Time**: <150ms
