# 🚀 FREE Deployment Guide for Resumate

## Overview

This guide shows you how to deploy Resumate **100% FREE** with:
- ✅ **Frontend**: Firebase Hosting (Free tier)
- ✅ **Backend**: Render (Free tier)
- ✅ **Database**: Firebase Firestore (Free tier)
- ✅ **Security**: API keys stored securely in environment variables

---

## 📋 Prerequisites

1. GitHub account (free)
2. Firebase account (free)
3. Render account (free) - sign up at https://render.com

---

## Step 1: Push Code to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Add your GitHub repo as remote
git remote add origin https://github.com/YOUR_USERNAME/resumate.git
git push -u origin main
```

---

## Step 2: Deploy Frontend to Firebase Hosting (FREE)

### 2.1 Build the frontend

```bash
npm run build
```

### 2.2 Deploy to Firebase

```bash
firebase deploy --only hosting
```

**Your frontend is now live at:** `https://resumate-7b399.web.app`

---

## Step 3: Deploy Backend to Render (FREE)

### 3.1 Sign up for Render

1. Go to https://render.com
2. Sign up with GitHub (recommended) or email
3. No credit card required for free tier!

### 3.2 Create a New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the service:

| Setting | Value |
|---------|-------|
| **Name** | `resumate-backend` |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Root Directory** | `server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | **Free** |

### 3.3 Add Environment Variables

In Render dashboard, go to **Environment** tab and add these variables:

```
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
GROK_API_KEY=your_grok_api_key
CLAUDE_API_KEY=your_claude_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
ALLOWED_ORIGIN=https://resumate-7b399.web.app
PORT=3001
```

**Where to get API keys:**
- **Groq (Recommended - FREE & FAST):** https://console.groq.com/keys
- **Gemini (FREE):** https://aistudio.google.com/app/apikey
- **Claude:** https://console.anthropic.com/keys
- **Grok:** https://console.x.ai/
- **OpenRouter:** https://openrouter.ai/keys

### 3.4 Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (2-5 minutes)
3. Copy your backend URL (e.g., `https://resumate-backend-xyz.onrender.com`)

**Important:** Free tier services "sleep" after 15 minutes of inactivity. First request after sleep takes ~30 seconds to wake up.

---

## Step 4: Update Frontend with Backend URL

### 4.1 Update `.env` file

Add your Render backend URL to the frontend `.env`:

```
VITE_BACKEND_URL=https://resumate-backend-xyz.onrender.com
```

### 4.2 Rebuild and Redeploy Frontend

```bash
npm run build
firebase deploy --only hosting
```

---

## Step 5: Test Your Deployment

1. **Visit your Firebase URL:** `https://resumate-7b399.web.app`
2. **Sign up** with email/password
3. **Test resume analysis** - first request may take 30s (Render waking up)
4. **Check all features:**
   - ATS scoring
   - Resume improvement
   - Resume tailoring
   - Job browsing

---

## 🔒 Security Notes

### ✅ What's Secure
- API keys stored in Render environment variables (not in code)
- Firebase config is public but harmless (only identifies your project)
- CORS enabled only for your Firebase Hosting domain

### ⚠️ Best Practices
1. **Never commit `.env` files** to GitHub
2. **Rotate API keys** if accidentally exposed
3. **Use `.gitignore`** to exclude sensitive files

---

## 📊 Free Tier Limits

| Service | Free Tier Limit |
|---------|-----------------|
| **Firebase Hosting** | 10 GB/month bandwidth |
| **Render** | 750 hours/month (enough for 1 service always-on) |
| **Firestore** | 1 GB storage, 50K reads/day |
| **Firebase Auth** | 10K users/month |

---

## 🚨 Troubleshooting

### Backend returns 500 error
- Check Render logs: Dashboard → Logs tab
- Verify all environment variables are set correctly

### Frontend can't connect to backend
- Update `VITE_BACKEND_URL` in `.env`
- Rebuild: `npm run build`
- Redeploy: `firebase deploy --only hosting`

### CORS error
- Add `ALLOWED_ORIGIN` environment variable in Render
- Format: `https://resumate-7b399.web.app` (no trailing slash)

### First request is slow
- This is normal! Render free tier "sleeps" after 15 min inactivity
- Subsequent requests will be fast

---

## 🎉 You're Live!

Your Resumate app is now deployed **100% FREE**:

- **Frontend:** https://resumate-7b399.web.app
- **Backend:** https://resumate-backend-xyz.onrender.com

---

## 📝 Quick Reference Commands

```bash
# Build frontend
npm run build

# Deploy frontend to Firebase
firebase deploy --only hosting

# Test backend locally
cd server
npm run dev

# View Render logs
# Go to Render Dashboard → Your Service → Logs
```

---

## 🔗 Useful Links

- **Firebase Console:** https://console.firebase.google.com/project/resumate-7b399
- **Render Dashboard:** https://dashboard.render.com
- **Firebase Hosting Docs:** https://firebase.google.com/docs/hosting
- **Render Docs:** https://render.com/docs
