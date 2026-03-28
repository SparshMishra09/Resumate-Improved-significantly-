# 🔐 GitHub Security Guide - Protect Your API Keys

**Created:** March 28, 2026  
**For:** Resumate Project

---

## ⚠️ Why This Matters

**API keys = Money + Access**
- Exposed keys can be stolen and used by others
- You could be charged for someone else's usage
- Attackers can access your Firebase database
- Your users' data could be compromised

---

## 📋 Checklist: Secure Your Repository

### ✅ Step 1: Enable GitHub Secret Scanning

1. Go to: https://github.com/SparshMishra09/Resumate-Improved-significantly-/settings/security
2. Enable these features:
   - **Secret scanning** → `Enable`
   - **Push protection** → `Enable`
   - **Secret scanning alerts** → `Enable`

### ✅ Step 2: Verify .gitignore is Working

Your `.gitignore` now blocks:
```
.env                    # Main environment file
.env.local              # Local overrides
.env.development        # Dev environment
.env.production         # Production environment
*.key, *.pem, *.crt     # Certificate files
secrets.json            # Any secrets files
firebase-adminsdk-*.json # Firebase service accounts
public/test-api.html    # Test files with keys
test-api.js             # Test scripts
```

### ✅ Step 3: Check if Files are Tracked

Run these commands to verify:

```bash
# Check if .env is ignored (should show nothing)
git ls-files .env

# Check what's actually tracked
git ls-files | findstr /i "env key secret"
```

If any sensitive files show up, remove them:
```bash
git rm --cached <filename>
git commit -m "Remove sensitive file"
git push
```

---

## 🚫 Never Commit These Files

### High Risk (API Keys & Credentials):
- ❌ `.env` - Contains all API keys
- ❌ `firebase-adminsdk-*.json` - Firebase admin access
- ❌ `credentials.json` - Any service credentials
- ❌ `secrets.json` - Self-explanatory
- ❌ `*.key`, `*.pem`, `*.crt` - SSL/TLS certificates

### Medium Risk (Test/Debug Files):
- ❌ `test-api.html` - Often contains test keys
- ❌ `debug.html` - May expose internal APIs
- ❌ `*.log` - May contain error traces with keys

### Low Risk (But Still Avoid):
- ⚠️ `node_modules/` - Large, unnecessary
- ⚠️ `dist/` - Build output
- ⚠️ `.vscode/` - Editor settings (except extensions.json)

---

## ✅ Safe to Commit

### Configuration Files (Without Secrets):
- ✅ `package.json` - Dependencies only
- ✅ `vite.config.js` - Build config (no keys)
- ✅ `tailwind.config.js` - Styling config
- ✅ `tsconfig.json` - TypeScript config
- ✅ `firebase.json` - Firebase hosting config (no keys)
- ✅ `firestore.rules` - Database security rules
- ✅ `firestore.indexes.json` - Database indexes

### Documentation:
- ✅ `README.md`
- ✅ `DEPLOYMENT_CHECKLIST.md`
- ✅ Any `.md` guides

### Source Code:
- ✅ `src/**/*.jsx`, `src/**/*.js`
- ✅ `src/**/*.css`
- ✅ `public/*.svg`, `public/*.png` (assets without keys)

---

## 🔧 Best Practices for Managing Secrets

### 1. Use `.env.example` as Template

**Create `.env.example`** (safe to commit):
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id

# AI API Keys
VITE_GROQ_API_KEY=your_groq_key_here
VITE_GEMINI_API_KEY=your_gemini_key_here

# Backend Server
PORT=3001
```

**Team members copy to `.env` and fill in real values:**
```bash
cp .env.example .env
# Then edit .env with actual keys
```

### 2. Use `.gitignore` Rules

```gitignore
# Block all .env files
.env
.env.*
!.env.example

# Block common secret file patterns
*.key
*.pem
secrets/
credentials/
```

### 3. Pre-commit Hook (Advanced)

Create `.git/hooks/pre-commit` to block secrets:

```bash
#!/bin/bash

# Check for .env files
if git diff --cached --name-only | grep -q "^\.env"; then
    echo "❌ ERROR: Cannot commit .env files!"
    echo "Add sensitive values to .env (ignored by git)"
    echo "Add placeholders to .env.example (safe to commit)"
    exit 1
fi

# Check for common secret patterns
if git diff --cached | grep -qE "(sk-[a-zA-Z0-9]{32,}|AIzaSy[a-zA-Z0-9_-]{33})"; then
    echo "❌ ERROR: Possible API key detected!"
    echo "Please remove secrets before committing."
    exit 1
fi
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

---

## 🚨 What to Do If You Accidentally Commit Secrets

### Immediate Actions (Within 5 Minutes):

1. **Don't panic** - But act fast!

2. **Rotate ALL exposed keys immediately:**
   - Groq: https://console.groq.com/keys → Create new key
   - Gemini: https://aistudio.google.com/app/apikey → Create new key
   - Firebase: https://console.firebase.google.com → Project Settings → Service Accounts

3. **Update your `.env` file** with new keys

4. **Remove secret from Git history:**

   **Option A: If just committed (not pushed):**
   ```bash
   git reset --soft HEAD~1
   git reset <sensitive-file>
   git commit -m "Commit message without sensitive file"
   ```

   **Option B: If already pushed:**
   ```bash
   # Install BFG Repo Cleaner (recommended)
   # Download from: https://rtyley.github.io/bfg-repo-cleaner/
   
   # Run BFG to remove file
   java -jar bfg.jar --delete-files <filename>
   
   # OR use git filter-branch
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch <filename>" \
     --prune-empty --tag-name-filter cat -- --all
   
   # Force push
   git push --force --all
   ```

5. **Enable GitHub Secret Scanning** (if not already)

6. **Check GitHub Security tab** for alerts

---

## 🛡️ GitHub Security Features Explained

### Secret Scanning
- **What:** Scans code for known API key patterns
- **When:** Runs on every push and periodically on existing code
- **Alerts:** Shows in Security → Secret scanning tab
- **Supported:** 200+ providers (GitHub, AWS, Stripe, etc.)

### Push Protection
- **What:** Blocks pushes containing detected secrets
- **When:** Before push completes
- **Error:** "GH013: Repository rule violations"
- **Fix:** Remove secret or mark as "false positive"

### Dependabot Alerts
- **What:** Warns about vulnerable dependencies
- **When:** When npm packages have known CVEs
- **Fix:** Run `npm audit fix` or update packages

---

## 📱 Quick Reference: Where to Get API Keys

| Service | URL | Free Tier |
|---------|-----|-----------|
| **Groq** | https://console.groq.com/keys | ✅ Free, fast |
| **Gemini** | https://aistudio.google.com/app/apikey | ✅ Free quota |
| **Claude** | https://console.anthropic.com/keys | ❌ Paid |
| **OpenRouter** | https://openrouter.ai/keys | ✅ Pay per use |
| **Firebase** | https://console.firebase.google.com | ✅ Free tier |
| **Adzuna** | https://developer.adzuna.com/ | ✅ Free API |

---

## ✅ Final Security Checklist

Before pushing to GitHub:

- [ ] `.env` file exists in `.gitignore`
- [ ] No API keys in source code (`.jsx`, `.js`)
- [ ] No API keys in public folder
- [ ] Using `.env.example` for team members
- [ ] Secret scanning enabled on GitHub
- [ ] Push protection enabled on GitHub
- [ ] Reviewed `git status` before commit
- [ ] Checked `git diff --cached` before push

---

## 🎯 For Resumate Project Specifically

### Safe Files (Already Committed):
✅ `firebase.json` - Hosting config (no keys)  
✅ `firestore.rules` - Database rules  
✅ `firestore.indexes.json` - Indexes  
✅ `src/config/firebase.js` - Uses `import.meta.env` (safe)  

### Never Commit:
❌ `.env` - Your actual API keys  
❌ `public/test-api.html` - Had hardcoded keys  
❌ `server/.env` - Backend keys  

### How Frontend Gets Keys Safely:
```javascript
// src/config/firebase.js - SAFE ✅
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,  // From .env
  // ...
};
```

The keys come from `.env` (not committed) and are injected at build time by Vite.

---

## 📞 Need Help?

- **GitHub Security Docs:** https://docs.github.com/code-security/secret-scanning
- **GitGuardian (Free Scanner):** https://www.gitguardian.com/
- **Have I Been Pwned:** https://haveibeenpwned.com/

---

**Remember:** Once a secret is on GitHub, assume it's compromised. Rotate immediately!
