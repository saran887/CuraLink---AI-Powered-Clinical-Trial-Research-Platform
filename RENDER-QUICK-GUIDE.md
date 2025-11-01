# 🎯 Quick Visual Guide - Deploy Backend on Render

```
┌─────────────────────────────────────────────────────────────┐
│  STEP-BY-STEP RENDER BACKEND DEPLOYMENT                     │
└─────────────────────────────────────────────────────────────┘

1️⃣  GO TO RENDER
    🌐 https://render.com
    🔑 Sign up with GitHub
    ⏱️  2 minutes

2️⃣  CREATE WEB SERVICE
    ➕ Click "New +" button
    📦 Select "Web Service"
    ⏱️  1 minute

3️⃣  CONNECT REPOSITORY
    🔗 Find: CuraLink---AI-Powered-Clinical-Trial-Research-Platform
    ✅ Click "Connect"
    ⏱️  2 minutes

4️⃣  CONFIGURE SERVICE
    📝 Name: curalink-backend
    📁 Root Directory: backend
    🐍 Runtime: Python 3
    🔨 Build: pip install -r requirements.txt
    ▶️  Start: uvicorn main:app --host 0.0.0.0 --port $PORT
    💰 Instance: Free
    ⏱️  3 minutes

5️⃣  ADD ENVIRONMENT VARIABLES
    🔑 GOOGLE_API_KEY = your-gemini-api-key
    💾 DATABASE_URL = sqlite:///./curalink.db
    🐛 DEBUG = False
    ⏱️  3 minutes

6️⃣  DEPLOY!
    🚀 Click "Create Web Service"
    ⏱️  30 seconds (to click button)

7️⃣  WAIT FOR BUILD
    📊 Watch the build logs...
    ⏳ Building dependencies...
    ✅ Build successful!
    ⏱️  5-7 minutes

8️⃣  COPY YOUR URL
    🌐 https://curalink-backend.onrender.com
    📋 Copy this URL!
    ⏱️  30 seconds

9️⃣  TEST IT
    🧪 Visit: https://your-url.onrender.com/docs
    ✅ See FastAPI Swagger UI
    🏥 Visit: https://your-url.onrender.com/health
    ✅ See: {"status": "healthy"}
    ⏱️  1 minute

🔟 UPDATE FRONTEND
    📝 Add to frontend/.env:
       VITE_API_URL=https://your-url.onrender.com/api
    🔄 Restart: npm run dev
    ⏱️  2 minutes

┌─────────────────────────────────────────────────────────────┐
│  TOTAL TIME: ~20 minutes                                     │
│  COST: $0/month (FREE TIER!)                                 │
│  RESULT: Your backend is LIVE! 🎉                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 📸 What You'll See

### Step 4 - Configuration Form:
```
┌────────────────────────────────────────────────┐
│ Name: [curalink-backend_______________]        │
│ Branch: [main ▼]                               │
│ Root Directory: [backend_____________]         │
│ Runtime: [Python 3 ▼]                          │
│ Build Command: [pip install -r requirements.txt]│
│ Start Command: [uvicorn main:app --host...]   │
│ Instance Type: [Free ▼]                        │
└────────────────────────────────────────────────┘
```

### Step 5 - Environment Variables:
```
┌────────────────────────────────────────────────┐
│ Environment Variables                          │
├────────────────────┬───────────────────────────┤
│ GOOGLE_API_KEY     │ AIzaSy...your-key...      │
│ DATABASE_URL       │ sqlite:///./curalink.db   │
│ DEBUG              │ False                     │
└────────────────────┴───────────────────────────┘
```

### Step 7 - Build Logs:
```
==> Cloning from GitHub...
==> Checking out commit...
==> Running 'pip install -r requirements.txt'
    Collecting fastapi==0.104.1 ✓
    Collecting uvicorn==0.24.0 ✓
    Collecting sqlalchemy==2.0.23 ✓
    ...
==> Build successful! 🎉
==> Starting service...
==> Your service is live! 🚀
```

### Step 9 - Testing:
```
Browser: https://curalink-backend.onrender.com/docs

You'll see:
┌────────────────────────────────────────────────┐
│ FastAPI                                        │
│ CuraLink API - Version 1.0.0                   │
│                                                │
│ [Try it out] buttons for all endpoints:       │
│   GET  /api/users/                            │
│   POST /api/users/                            │
│   GET  /api/trials/                           │
│   POST /api/ai/summarize                      │
│   ...                                         │
└────────────────────────────────────────────────┘
```

---

## ⚡ Quick Reference Card

**Keep this handy while deploying:**

| Setting | Value |
|---------|-------|
| **Website** | render.com |
| **Root Directory** | `backend` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| **Runtime** | Python 3 |
| **Instance** | Free |

**Environment Variables:**
- `GOOGLE_API_KEY` → Get from backend/.env
- `DATABASE_URL` → `sqlite:///./curalink.db`
- `DEBUG` → `False`

---

## 🆘 Quick Troubleshooting

| Problem | Quick Fix |
|---------|-----------|
| Can't find repo | Click "Configure account" → Allow access |
| Build fails | Check Root Directory = `backend` |
| Won't start | Check Start Command has `$PORT` |
| 500 errors | Verify GOOGLE_API_KEY is set |
| Slow first request | Normal! Free tier sleeps. Wakes in 30s |

---

## ✅ Success Indicators

You'll know it worked when:
- ✅ Build log shows "Build successful"
- ✅ Status shows green "Live" badge
- ✅ `/docs` shows FastAPI Swagger UI
- ✅ `/health` returns JSON with healthy status
- ✅ No red error messages in logs

---

**📖 Need more details? Check RENDER-BACKEND-DEPLOY.md for full guide!**
