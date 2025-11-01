# CuraLink - Free Deployment Guide

## 🚀 Deploy Your App for FREE

### Option 1: Vercel (Frontend) + Render (Backend) - RECOMMENDED

#### **Frontend Deployment (Vercel)**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import `CuraLink---AI-Powered-Clinical-Trial-Research-Platform`
5. Configure:
   - Framework Preset: **Vite**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add Environment Variable:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend-url.onrender.com` (add after backend deployment)
7. Click **Deploy**

#### **Backend Deployment (Render)**
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - Name: `curalink-backend`
   - Root Directory: `backend`
   - Runtime: **Python 3**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add Environment Variables:
   - `GOOGLE_API_KEY` = `AIzaSyCZoj4JKUp1HN0rdZKSYmwg3IcPxAIKqHg`
   - `DATABASE_URL` = `sqlite:///./curalink.db`
   - `DEBUG` = `False`
7. Click **Create Web Service**
8. **Copy the backend URL** (e.g., `https://curalink-backend.onrender.com`)
9. Go back to Vercel → Your Project → Settings → Environment Variables
10. Update `VITE_API_URL` with your Render backend URL
11. Redeploy your Vercel frontend

---

### Option 2: Railway (Both Frontend + Backend)

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository

#### Backend Service:
- Root Directory: `backend`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Add environment variables (same as above)

#### Frontend Service:
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Start Command: `npm run preview`
- Add environment variable: `VITE_API_URL` = backend URL

---

### Option 3: Netlify (Frontend) + Render (Backend)

#### Frontend (Netlify):
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click "Add new site" → "Import existing project"
4. Configure:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
5. Add environment variable: `VITE_API_URL`

#### Backend: Follow Render steps above

---

## 📋 Pre-Deployment Checklist

Before deploying, update your frontend API configuration:

### Update `frontend/.env.production`:
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

### Update `frontend/src/services/api.js`:
Make sure the baseURL uses environment variable:
```javascript
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

---

## 🎯 Recommended Steps (Easiest Path)

1. **Deploy Backend First** (Render - 5 minutes)
   - Get your backend URL
   
2. **Update Frontend Config** (2 minutes)
   - Add backend URL to environment variables
   
3. **Deploy Frontend** (Vercel - 3 minutes)
   - Your app will be live!

4. **Test Your Live App** (2 minutes)
   - Visit your Vercel URL
   - Create test patient account
   - Try AI features

---

## 💡 Free Tier Limits

| Platform | Free Tier | Limitations |
|----------|-----------|-------------|
| **Vercel** | Unlimited | 100GB bandwidth/month |
| **Render** | 750 hours/month | Sleeps after 15 min inactivity (wakes in ~30s) |
| **Railway** | $5 free credits/month | ~500 hours uptime |
| **Netlify** | 100GB bandwidth | 300 build minutes/month |

---

## 🔧 Troubleshooting

### Backend sleeps on Render?
Add this to keep it awake (optional):
- Use [cron-job.org](https://cron-job.org) to ping your backend every 10 minutes
- Ping URL: `https://your-backend.onrender.com/health`

### CORS errors?
Update `backend/main.py` CORS settings:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Database persistence on Render?
Render's free tier uses ephemeral storage. For persistence:
- Upgrade to paid plan ($7/month)
- Or use [Supabase PostgreSQL](https://supabase.com) (free tier available)

---

## 🎉 After Deployment

Update your GitHub README with:
- ✅ Live Demo Link
- ✅ API Documentation Link
- ✅ Deployment status badges

**Your app will be live at:**
- Frontend: `https://curalink.vercel.app`
- Backend: `https://curalink-backend.onrender.com`

Good luck with your deployment! 🚀
