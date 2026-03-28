# 🔥 Firebase Hosting Guide for Resumate

## 📋 Overview

This guide will help you deploy Resumate to Firebase Hosting with:
- ✅ Frontend on Firebase Hosting
- ✅ Backend on Cloud Functions (or keep separate)
- ✅ Firestore Database
- ✅ Firebase Authentication

---

## 🚀 Option 1: Full Firebase Deployment (Recommended)

### Step 1: Install Firebase Tools

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

### Step 3: Initialize Firebase in Your Project

```bash
firebase init
```

**Select these options:**
- ✅ **Hosting** (for frontend)
- ✅ **Firestore** (for database)
- ✅ **Functions** (optional, for backend)

**Configuration:**
```
? What do you want to use as your public directory? dist
? Configure as a single-page app? Yes
? Set up automatic builds and deploys with GitHub? No
? File dist/index.html already exists. Overwrite? No
```

### Step 4: Build Frontend

```bash
npm run build
```

This creates the `dist/` folder with production files.

### Step 5: Deploy to Firebase

```bash
firebase deploy
```

This will deploy:
- Frontend to Firebase Hosting
- Firestore rules
- Firestore indexes

---

## 🌐 Option 2: Separate Hosting (Easier)

### Frontend: Firebase Hosting

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Initialize Firebase Hosting:**
   ```bash
   firebase init hosting
   ```

3. **Configure:**
   ```
   ? What do you want to use as your public directory? dist
   ? Configure as a single-page app? Yes
   ```

4. **Deploy:**
   ```bash
   firebase deploy --only hosting
   ```

### Backend: Railway / Render / Vercel

**For Railway:**
1. Push code to GitHub
2. Go to https://railway.app
3. Create new project → Deploy from GitHub
4. Set root directory to `server/`
5. Add environment variables
6. Deploy

**For Render:**
1. Push code to GitHub
2. Go to https://render.com
3. New Web Service
4. Connect GitHub repo
5. Root directory: `server`
6. Build command: `npm install`
7. Start command: `npm run dev` (or `npm start` for production)

---

## ⚙️ Environment Variables

### Firebase Console
Go to: https://console.firebase.google.com/project/YOUR_PROJECT/settings

Add these environment variables:
```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_id
VITE_GROQ_API_KEY=your_groq_key
VITE_GEMINI_API_KEY=your_gemini_key
```

---

## 📊 Complete Deployment Checklist

### 1. Firebase Setup
- [ ] Create Firebase project
- [ ] Enable Authentication (Email/Password)
- [ ] Create Firestore Database
- [ ] Deploy Firestore rules: `firebase deploy --only firestore:rules`
- [ ] Deploy Firestore indexes: `firebase deploy --only firestore:indexes`

### 2. Frontend Deployment
- [ ] Build frontend: `npm run build`
- [ ] Initialize Firebase Hosting: `firebase init hosting`
- [ ] Deploy: `firebase deploy --only hosting`
- [ ] Note your hosting URL

### 3. Backend Deployment
- [ ] Choose hosting (Railway, Render, or Firebase Functions)
- [ ] Deploy backend
- [ ] Note your backend URL
- [ ] Update frontend `.env` with backend URL

### 4. Update Configuration
- [ ] Update `BACKEND_URL` in `src/services/ai.js`
- [ ] Rebuild frontend with new URL
- [ ] Redeploy frontend

---

## 🎯 Quick Deploy Commands

### Full Deploy (Everything)
```bash
# Build
npm run build

# Deploy everything
firebase deploy
```

### Deploy Only Hosting
```bash
firebase deploy --only hosting
```

### Deploy Only Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### Deploy Only Firestore Indexes
```bash
firebase deploy --only firestore:indexes
```

---

## 🔗 Custom Domain (Optional)

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Enter your domain
4. Follow DNS configuration steps
5. Wait for SSL certificate (can take up to 24 hours)

---

## 📈 Monitoring Your Deployment

### Firebase Console
- **Hosting**: https://console.firebase.google.com/project/YOUR_PROJECT/hosting
- **Firestore**: https://console.firebase.google.com/project/YOUR_PROJECT/firestore
- **Authentication**: https://console.firebase.google.com/project/YOUR_PROJECT/authentication

### View Logs
```bash
# Hosting logs
firebase hosting:log
```

---

## 🚨 Troubleshooting

### 404 on Refresh
Add to `firebase.json`:
```json
{
  "hosting": {
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Backend Connection Error
Update `BACKEND_URL` in `src/services/ai.js`:
```javascript
const BACKEND_URL = 'https://your-backend-url.railway.app/api';
```

Then rebuild and redeploy:
```bash
npm run build
firebase deploy --only hosting
```

---

## ✅ Post-Deployment Testing

1. **Visit your Firebase URL**
2. **Sign up** - verify you get 1 credit
3. **Test all features:**
   - ATS scoring
   - Resume improvement
   - Resume tailoring
   - Job browsing
   - Save jobs
4. **Check Firebase Console** for user data

---

## 🎉 You're Live!

Your Resumate app is now hosted on Firebase!

**Share your URL:**
- Firebase Hosting: `https://YOUR_PROJECT.web.app`
- Custom Domain: `https://yourdomain.com`

---

**Need Help?**
- Firebase Docs: https://firebase.google.com/docs
- Firebase Support: https://firebase.google.com/support
