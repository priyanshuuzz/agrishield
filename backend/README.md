# AgriShield AI - Backend API

Production-ready Flask backend for AgriShield AI frontend integration.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Run Server
```bash
python app.py
```

Server will start at: `http://localhost:5000`

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### 1. Chatbot
```http
POST /api/chat
Content-Type: application/json

{
  "message": "Kaunsi fasal best hai?",
  "context": {
    "riskScore": 45,
    "rainfall": 25,
    "temperature": 28,
    "humidity": 65,
    "topCrop": "Bajra"
  }
}

Response:
{
  "response": "Aapke area mein 25mm rainfall hai. Bajra best option hai.",
  "timestamp": "2026-03-19T10:30:00",
  "suggestions": ["Kaunsi fasal best hai?", "Risk score kya hai?"]
}
```

### 2. Risk Analysis
```http
POST /api/risk-analysis
Content-Type: application/json

{
  "rainfall": 25,
  "temperature": 28,
  "soilType": "Loamy",
  "season": "Kharif"
}

Response:
{
  "riskScore": 42,
  "factors": [
    {
      "name": "Low Rainfall",
      "impact": "High",
      "description": "Insufficient rainfall may affect crop growth"
    }
  ],
  "recommendations": [
    "Monitor weather closely",
    "Ensure adequate irrigation"
  ],
  "timestamp": "2026-03-19T10:30:00"
}
```

### 3. Crop Recommendations
```http
POST /api/crop-recommendations
Content-Type: application/json

{
  "rainfall": 25,
  "temperature": 28,
  "soilType": "Loamy"
}

Response:
{
  "crops": [
    {
      "name": "Bajra",
      "score": 85.5,
      "reason": "Excellent match for current conditions",
      "suitability": "High"
    },
    {
      "name": "Maize",
      "score": 72.3,
      "reason": "Good option with proper care",
      "suitability": "High"
    }
  ],
  "timestamp": "2026-03-19T10:30:00"
}
```

### 4. What-If Scenario
```http
POST /api/what-if
Content-Type: application/json

{
  "current": {
    "rainfall": 25,
    "temperature": 28,
    "riskScore": 45
  },
  "changes": {
    "rainfall": 35,
    "temperature": 30
  }
}

Response:
{
  "newRiskScore": 38,
  "oldRiskScore": 45,
  "impact": {
    "riskChange": -7,
    "direction": "decreased",
    "magnitude": 7,
    "factors": [
      {
        "factor": "Rainfall",
        "change": "+10.0mm",
        "effect": "Positive"
      }
    ]
  },
  "recommendations": [
    "Conditions have improved",
    "Good time to proceed with planned activities"
  ],
  "timestamp": "2026-03-19T10:30:00"
}
```

### 5. Health Check
```http
GET /api/health

Response:
{
  "status": "healthy",
  "service": "AgriShield AI Backend",
  "version": "1.0.0",
  "timestamp": "2026-03-19T10:30:00"
}
```

### 6. Soil Types
```http
GET /api/soil-types

Response:
{
  "soilTypes": ["Sandy", "Clay", "Loamy", "Black", "Red"],
  "timestamp": "2026-03-19T10:30:00"
}
```

## 🔧 Features

- ✅ Context-aware chatbot with Hinglish support
- ✅ Risk analysis based on weather and soil
- ✅ Intelligent crop recommendations
- ✅ What-if scenario simulation
- ✅ CORS enabled for frontend connection
- ✅ Error handling and validation
- ✅ Production-ready responses

## 🌐 CORS Configuration

CORS is enabled for all origins. For production, update `app.py`:

```python
CORS(app, origins=['https://your-frontend-domain.com'])
```

## 🧪 Testing

Test with curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Chat
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","context":{}}'

# Risk analysis
curl -X POST http://localhost:5000/api/risk-analysis \
  -H "Content-Type: application/json" \
  -d '{"rainfall":25,"temperature":28,"soilType":"Loamy","season":"Kharif"}'
```

## 📦 Dependencies

- Flask 3.0.0 - Web framework
- flask-cors 4.0.0 - CORS support
- python-dotenv 1.0.0 - Environment variables

## 🚀 Production Deployment

### Option 1: Railway
```bash
railway login
railway init
railway up
```

### Option 2: Heroku
```bash
heroku create agrishield-api
git push heroku main
```

### Option 3: Docker
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

## 🔒 Security Notes

- Add rate limiting for production
- Implement API key authentication
- Use environment variables for sensitive data
- Enable HTTPS in production
- Add input validation and sanitization

## 📝 License

Part of AgriShield AI project.
