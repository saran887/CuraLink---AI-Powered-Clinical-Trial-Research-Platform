# 🚀 Quick Start: Deploy CuraLink for FREE in 10 Minutes

## Fastest Way to Go Live (Recommended)

### Step 1: Deploy Backend (5 minutes)
1. Visit **[render.com](https://render.com)** → Sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your repository: `CuraLink---AI-Powered-Clinical-Trial-Research-Platform`
4. Configure:
   ```
   Name: curalink-backend
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
5. Add Environment Variables:
   - `GOOGLE_API_KEY` = `your-google-gemini-api-key-here`
   - `DATABASE_URL` = `sqlite:///./curalink.db`
6. Click **"Create Web Service"**
7. ✅ **Copy your backend URL** (e.g., `https://curalink-backend.onrender.com`)

### Step 2: Deploy Frontend (3 minutes)
1. Visit **[vercel.com](https://vercel.com)** → Sign up with GitHub
2. Click **"New Project"** → Import your repository
3. Configure:
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```
4. Add Environment Variable:
   - Name: `VITE_API_URL`
   - Value: `https://YOUR-BACKEND-URL.onrender.com/api` (paste from Step 1)
5. Click **"Deploy"**
6. ✅ **Your app is LIVE!** (e.g., `https://curalink.vercel.app`)

### Step 3: Update CORS (2 minutes)
1. Open `backend/main.py` in your local editor
2. Update the CORS origins:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=[
           "http://localhost:5173",
           "https://curalink.vercel.app",  # Your Vercel URL
           "https://YOUR-FRONTEND-URL.vercel.app"
       ],
   ```
3. Commit and push:
   ```bash
   git add backend/main.py
   git commit -m "Update CORS for production"
   git push
   ```
4. Render will auto-deploy the update!

---

## 📱 Test Your Live App

Visit your Vercel URL and try:
- ✅ Create a patient account
- ✅ Use AI condition detection
- ✅ Search clinical trials
- ✅ Find health experts with AI matching

---

## 💡 Pro Tips

**Backend keeps sleeping?** (Render free tier)
- First request may take 30 seconds to wake up
- Use [cron-job.org](https://cron-job.org) to ping your backend every 10 minutes
- Ping URL: `https://your-backend.onrender.com/health`

**Need database persistence?**
- Render free tier = ephemeral storage (resets on restart)
- For permanent data: Upgrade Render ($7/month) or use Supabase PostgreSQL (free)

**Want a custom domain?**
- Vercel allows custom domains on free tier!
- Go to Project Settings → Domains → Add your domain

---

## 🎯 Free Tier Summary

| Service | Cost | Features |
|---------|------|----------|
| **Render** | $0 | Backend hosting, auto-deploy from GitHub |
| **Vercel** | $0 | Frontend hosting, CDN, auto-deploy |
| **Total** | **$0/month** | ✨ Fully functional AI-powered platform! |

---

## 🆘 Troubleshooting

**Issue:** API calls failing from frontend
- **Fix:** Check `VITE_API_URL` environment variable in Vercel settings

**Issue:** CORS errors in browser console
- **Fix:** Update `backend/main.py` CORS origins with your Vercel URL

**Issue:** Backend 404 on Render
- **Fix:** Check `backend/Procfile` has correct start command

---

## 📚 More Options

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for:
- Netlify deployment
- Railway deployment
- Alternative hosting options

---

## ✅ After Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] CORS configured with production URLs
- [ ] Environment variables set correctly
- [ ] Test all features work live
- [ ] Update GitHub README with live demo link
- [ ] Share your live app! 🎉

**Need help?** Check the full deployment guide in `DEPLOYMENT.md`
