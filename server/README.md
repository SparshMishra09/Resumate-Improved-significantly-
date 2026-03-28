# 🚀 Resumate Backend Setup

## What This Solves

✅ **CORS Errors** - No more browser CORS issues  
✅ **API Key Security** - Keys hidden from frontend  
✅ **Better Error Handling** - Centralized error management  
✅ **Provider Rotation** - Auto-fallback between providers  
✅ **Rate Limiting** - Can add rate limiting server-side  

---

## 📦 Quick Setup

### Step 1: Install Backend Dependencies

```bash
cd server
npm install
```

### Step 2: Copy Environment Variables

The backend uses the **same `.env`** file as frontend (in root directory).

Make sure your `.env` has:

```env
VITE_GEMINI_API_KEY=AIzaSyYourKey
VITE_CLAUDE_API_KEY=sk-ant-YourKey
VITE_GROK_API_KEY=gsk_YourKey
VITE_OPENROUTER_API_KEY=sk-or-v1-YourKey
```

### Step 3: Start Backend Server

**Option A: Development (auto-reload)**
```bash
cd server
npm run dev
```

**Option B: Production**
```bash
cd server
npm start
```

### Step 4: Start Frontend (in another terminal)

```bash
npm run dev
```

---

## 🎯 How It Works

### Before (Direct API Calls):
```
Browser → Gemini API ❌ CORS
Browser → Claude API ❌ CORS
Browser → Grok API ✅ Works
```

### After (Backend Proxy):
```
Browser → Backend Server → Gemini API ✅
Browser → Backend Server → Claude API ✅
Browser → Backend Server → Grok API ✅
```

---

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Check server status |
| `/api/gemini` | POST | Direct Gemini call |
| `/api/claude` | POST | Direct Claude call |
| `/api/grok` | POST | Direct Grok call |
| `/api/openrouter` | POST | Direct OpenRouter call |
| `/api/analyze` | POST | **Smart router** (tries all) |

---

## 🧪 Test Backend

### 1. Check Health
```bash
curl http://localhost:3001/api/health
```

Should return:
```json
{
  "status": "ok",
  "providers": [
    { "name": "gemini", "available": true },
    { "name": "claude", "available": true },
    { "name": "grok", "available": true },
    { "name": "openrouter", "available": true }
  ]
}
```

### 2. Test Analysis
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Analyze this resume..."}'
```

---

## 🔧 Troubleshooting

### "Cannot connect to backend"
```bash
# Make sure backend is running
cd server
npm run dev
```

### "Port 3001 already in use"
Edit `server/server.js`:
```javascript
const PORT = process.env.PORT || 3002; // Change port
```

Then update frontend `src/services/ai.js`:
```javascript
const BACKEND_URL = 'http://localhost:3002/api';
```

### "API key not configured"
Check that `.env` file exists in **root directory** (not server folder).

---

## 🎯 What Changed in Frontend

### Before:
```javascript
// Direct API calls (CORS issues)
await axios.post('https://api.anthropic.com/v1/messages', ...)
```

### After:
```javascript
// Backend proxy (no CORS)
await axios.post('http://localhost:3001/api/analyze', ...)
```

**No code changes needed!** The `ai.js` service is already updated.

---

## ✅ Checklist

- [ ] `cd server`
- [ ] `npm install`
- [ ] Check `.env` has API keys
- [ ] `npm run dev` (backend)
- [ ] In another terminal: `npm run dev` (frontend)
- [ ] Test at http://localhost:5173
- [ ] Upload resume - should work!

---

## 🚀 Running Both Servers

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

**Both should be running simultaneously!**

---

## 💡 Pro Tips

1. **Backend runs on port 3001**
2. **Frontend runs on port 5173**
3. **Backend auto-reloads** with `npm run dev`
4. **Check backend logs** for API call details

---

**Once backend is running, all CORS issues are solved!** 🎉
