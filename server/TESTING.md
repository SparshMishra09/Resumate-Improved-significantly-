# 🧪 Backend Testing Guide

## Step 1: Check Backend is Running

Open: http://localhost:3001/api/health

**Expected Response:**
```json
{
  "status": "ok",
  "providers": [
    { "name": "gemini", "available": true },
    { "name": "claude", "available": true },
    { "name": "grok", "available": true },
    { "name": "openrouter", "available": true }
  ],
  "uptime": 123.456
}
```

---

## Step 2: Check Backend Console

You should see logs like:

```
============================================================
[Backend] Starting Resumate AI Server...
[Backend] Environment: development
[Backend] API Keys configured:
  ✓ GEMINI: AIzaSyAO0LUcMfvfgT_l... (length: 39)
  ✓ CLAUDE: sk-ant-api03-EWkPCUR... (length: 108)
  ✓ GROK: gsk_nxKXH2maZi7zIky1... (length: 56)
  ✓ OPENROUTER: sk-or-v1-1d8abbf86... (length: 73)
[Backend] Full env check:
  VITE_GEMINI_API_KEY exists: true
  VITE_CLAUDE_API_KEY exists: true
  VITE_GROK_API_KEY exists: true
  VITE_OPENROUTER_API_KEY exists: true
============================================================

🚀 Resumate Backend running on http://localhost:3001
✅ Backend ready to accept requests!
```

---

## Step 3: Test Individual APIs

### Test Gemini (Will fail with 429 if quota exceeded)
```bash
curl -X POST http://localhost:3001/api/gemini \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Say OK"}'
```

### Test Grok
```bash
curl -X POST http://localhost:3001/api/grok \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Say OK"}'
```

### Test Smart Router (Tries all providers)
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Analyze this resume: John Doe..."}'
```

---

## Step 4: Test Frontend Integration

1. **Open** http://localhost:5173
2. **Open Console** (F12)
3. **Upload Resume**
4. **Watch Logs:**

**Expected Flow:**
```
[Frontend] Sending to backend for analysis...
[Router] Received analyze request
[Router] Available providers: ['gemini', 'grok', 'claude', 'openrouter']
[Router] >>> Trying GEMINI...
[Gemini] Processing request...
[Gemini] Response status: 200
[Gemini] Success!
[Router] >>> GEMINI SUCCEEDED!
[Frontend] Backend response: { success: true, data: {...}, provider: 'gemini' }
[Frontend] Success via gemini!
```

---

## 🔧 Troubleshooting

### Backend Shows "NOT CONFIGURED" for All Keys

**Problem:** Backend can't find .env file

**Fix:**
1. Check .env exists in **root directory** (not server folder)
2. Restart backend:
   ```bash
   # Stop (Ctrl+C)
   cd server
   npm run dev
   ```

### Backend Health Shows All Keys Available But Still Fails

**Problem:** API keys themselves are invalid

**Fix:**
- **Gemini**: Check quota at https://console.cloud.google.com/
- **Claude**: Check key at https://console.anthropic.com/
- **Grok**: Check key at https://console.x.ai/
- **OpenRouter**: Create new key (yours is revoked)

### Frontend Still Shows "Cannot connect to backend"

**Problem:** Backend not running or wrong port

**Fix:**
1. Check backend is running: http://localhost:3001/api/health
2. Check port in `server/server.js`
3. Restart both servers

### 500 Error on /api/analyze

**Check Backend Console** for detailed error:
```
[Router] >>> GEMINI FAILED: 429 - Quota exceeded
[Router] >>> GROK FAILED: 400 - Invalid model
[Router] >>> ALL PROVIDERS FAILED
```

Then fix the specific provider issue.

---

## ✅ Success Indicators

### Backend Console:
```
[Router] >>> GROK SUCCEEDED!
```

### Frontend Console:
```
[Frontend] Success via grok!
```

### Frontend UI:
Resume analysis results appear!

---

## 📊 Expected Behavior by Provider

| Provider | Expected Status | Notes |
|----------|----------------|-------|
| **Gemini** | ⚠️ 429 (Quota) | Need new project or wait 24h |
| **Claude** | ✅ 200 (Works) | No CORS from backend |
| **Grok** | ✅ 200 (Works) | Fixed model name |
| **OpenRouter** | ❌ 401 (Revoked) | Need new account |

---

**Once you see "SUCCEEDED" for any provider, it's working!** 🎉
