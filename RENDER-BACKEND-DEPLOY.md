# 🚀 Deploy CuraLink Backend on Render - Step by Step Guide

## Prerequisites
✅ GitHub account with your CuraLink repository
✅ Google Gemini API key (you already have this in backend/.env)

---

## Step 1: Create Render Account (2 minutes)

1. Go to **https://render.com**
2. Click **"Get Started"** or **"Sign Up"**
3. Choose **"Sign up with GitHub"**
4. Authorize Render to access your GitHub repositories
5. ✅ You're now logged into Render!

---

## Step 2: Create New Web Service (1 minute)

1. On Render Dashboard, click the **"New +"** button (top right)
2. Select **"Web Service"** from the dropdown menu
3. You'll see "Create a new Web Service" page

---

## Step 3: Connect Your Repository (2 minutes)

### Option A: If you see your repository listed
1. Find `CuraLink---AI-Powered-Clinical-Trial-Research-Platform` in the list
2. Click **"Connect"** button next to it

### Option B: If you don't see it
1. Click **"Configure account"** link
2. In the popup, select your GitHub account
3. Choose either:
   - **"All repositories"** (easier), OR
   - **"Only select repositories"** → Select CuraLink
4. Click **"Install"** or **"Save"**
5. Back on Render, click **"Connect"** next to your repo

---

## Step 4: Configure Web Service (3 minutes)

Fill in these fields **exactly**:

### Basic Information
```
Name: curalink-backend
(or any name you prefer - this becomes your URL)
```

### Repository & Branch
```
Branch: main
(should be auto-selected)
```

### Root Directory
```
Root Directory: backend
⚠️ IMPORTANT: Type "backend" without quotes
This tells Render where your Python app is located
```

### Runtime
```
Runtime: Python 3
(Select from dropdown)
```

### Build Command
```
Build Command: pip install -r requirements.txt
(This installs all your Python dependencies)
```

### Start Command
```
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
(This starts your FastAPI server)
```

### Instance Type
```
Instance Type: Free
(Select "Free" - $0/month, 512MB RAM, sleeps after 15 min inactivity)
```

---

## Step 5: Add Environment Variables (3 minutes)

Scroll down to **"Environment Variables"** section:

### Click "Add Environment Variable" and add these THREE variables:

#### Variable 1:
```
Key:   GOOGLE_API_KEY
Value: [Paste your actual Gemini API key here]
```
**Where to find it:** Open `backend/.env` file in your project

#### Variable 2:
```
Key:   DATABASE_URL
Value: sqlite:///./curalink.db
```

#### Variable 3:
```
Key:   DEBUG
Value: False
```

**Screenshot of what it should look like:**
```
┌─────────────────────┬──────────────────────────────────┐
│ Key                 │ Value                            │
├─────────────────────┼──────────────────────────────────┤
│ GOOGLE_API_KEY      │ AIzaSy...your-key...             │
│ DATABASE_URL        │ sqlite:///./curalink.db          │
│ DEBUG               │ False                            │
└─────────────────────┴──────────────────────────────────┘
```

---

## Step 6: Create Web Service (30 seconds)

1. Scroll to the bottom
2. Click the big blue **"Create Web Service"** button
3. Render will start deploying immediately!

---

## Step 7: Wait for Deployment (5-7 minutes)

You'll see a build log with output like:
```
==> Cloning from https://github.com/saran887/CuraLink...
==> Checking out commit abc123...
==> Downloading cache...
==> Running 'pip install -r requirements.txt'
    Collecting fastapi==0.104.1
    Collecting uvicorn==0.24.0
    ...
==> Build successful 🎉
==> Starting service with 'uvicorn main:app --host 0.0.0.0 --port $PORT'
==> Your service is live 🎉
```

### What to watch for:
- ✅ Green checkmarks = Good!
- ❌ Red errors = Check your configuration
- ⏳ "In Progress" = Be patient, first deploy takes 5-7 minutes

---

## Step 8: Copy Your Backend URL (30 seconds)

1. Once deployed, you'll see **"Your service is live at..."**
2. At the top of the page, find your service URL:
   ```
   https://curalink-backend.onrender.com
   (or whatever name you chose)
   ```
3. **📋 COPY THIS URL** - you'll need it for the frontend!

---

## Step 9: Test Your Backend (1 minute)

### Test in browser:
1. Click on your service URL or paste it in a new browser tab
2. Add `/docs` to the end: `https://curalink-backend.onrender.com/docs`
3. You should see the **FastAPI Swagger documentation page**
4. ✅ If you see it, your backend is working!

### Test the health endpoint:
1. In browser, visit: `https://curalink-backend.onrender.com/health`
2. You should see:
   ```json
   {"status": "healthy", "api_configured": true}
   ```
3. ✅ Perfect! Your backend is fully functional!

---

## Step 10: Update Frontend Configuration (2 minutes)

Now connect your frontend to the deployed backend:

### Option A: For Local Development
1. Open `frontend/.env` (create if doesn't exist)
2. Add this line:
   ```
   VITE_API_URL=https://curalink-backend.onrender.com/api
   ```
3. Restart your frontend: `npm run dev`

### Option B: For Vercel/Netlify Deployment
1. When deploying frontend, add environment variable:
   - Key: `VITE_API_URL`
   - Value: `https://curalink-backend.onrender.com/api`

---

## 🎉 Success Checklist

After completing all steps, verify:

- [ ] ✅ Render account created and connected to GitHub
- [ ] ✅ Web service created with correct configuration
- [ ] ✅ All 3 environment variables added
- [ ] ✅ Build completed successfully (green checkmark)
- [ ] ✅ Service is "Live" (not "Failed" or "Building")
- [ ] ✅ Backend URL copied
- [ ] ✅ `/docs` endpoint shows FastAPI documentation
- [ ] ✅ `/health` endpoint returns healthy status
- [ ] ✅ Frontend configuration updated with new URL

---

## 🔧 Common Issues & Solutions

### Issue 1: Build fails with "requirements.txt not found"
**Solution:** Check that Root Directory is set to `backend`

### Issue 2: "Port already in use" or server won't start
**Solution:** Ensure Start Command is exactly: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Issue 3: API returns 500 errors
**Solution:** Check Environment Variables are set correctly, especially GOOGLE_API_KEY

### Issue 4: Service keeps restarting
**Solution:** Check the logs for Python errors. May need to update `requirements.txt`

### Issue 5: First request takes 30 seconds
**Solution:** This is normal! Free tier sleeps after 15 min. Use cron-job.org to keep it awake.

---

## 📊 Understanding Render Free Tier

| Feature | Free Tier |
|---------|-----------|
| **RAM** | 512 MB |
| **CPU** | Shared |
| **Uptime** | 750 hours/month |
| **Sleep** | After 15 min inactivity |
| **Wake time** | ~30 seconds on first request |
| **Storage** | Ephemeral (resets on restart) |
| **Price** | **$0/month** 🎉 |

### What "Sleeps after 15 min" means:
- If no one visits your site for 15 minutes, Render pauses your service
- Next visitor waits ~30 seconds while it wakes up
- After waking, it runs normally
- To keep it awake 24/7: Use [cron-job.org](https://cron-job.org) to ping `/health` every 10 minutes

---

## 🚀 Next Steps

After backend is deployed:

1. **Deploy Frontend** - Use Vercel or Netlify (see QUICKSTART-DEPLOY.md)
2. **Update CORS** - Add your frontend URL to `backend/main.py` CORS settings
3. **Test End-to-End** - Create account, try AI features
4. **Set up monitoring** - Use Render's built-in logs and metrics

---

## 💡 Pro Tips

1. **Custom Domain**: Render allows custom domains even on free tier!
2. **Logs**: Click "Logs" tab in Render dashboard to debug issues
3. **Metrics**: Monitor CPU/RAM usage in "Metrics" tab
4. **Auto-Deploy**: Render auto-deploys when you push to GitHub main branch
5. **Manual Deploy**: Click "Manual Deploy" → "Deploy latest commit" to redeploy

---

## 🆘 Need Help?

- **Render Docs**: https://render.com/docs/web-services
- **Render Discord**: https://discord.gg/render
- **Check Logs**: Render Dashboard → Your Service → Logs tab

---

**Your backend is now live and ready to serve requests! 🎊**

Next: Deploy your frontend to complete the full stack deployment!
