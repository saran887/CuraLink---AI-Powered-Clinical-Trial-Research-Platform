# 🚀 CuraLink Quick Start Guide

## Get Running in 5 Minutes!

### Step 1: Start the Backend

Open PowerShell and run:

```powershell
cd "d:\AI Full Stack Engineer job\curalink\backend"
python -m venv venv
.\venv\Scripts\Activate
pip install -r requirements.txt
uvicorn main:app --reload
```

✅ Backend running at: **http://localhost:8000**
📚 API Docs available at: **http://localhost:8000/docs**

---

### Step 2: Start the Frontend

Open a **NEW** PowerShell terminal and run:

```powershell
cd "d:\AI Full Stack Engineer job\curalink\frontend"
npm install
npm run dev
```

✅ Frontend running at: **http://localhost:5173**

---

### Step 3: Explore the App

1. **Visit** http://localhost:5173
2. **Click** "I'm a Patient" to onboard as a patient
3. **Enter** your name, location, and condition
4. **Explore** recommended trials and publications
5. **Click** "✨ Summarize" to see AI summaries
6. **Try** the Forum and Favorites features

Or click "I'm a Researcher" to:
- Create clinical trials
- Publish research
- Manage your work

---

## 🎯 Quick Test Commands

### Create Sample Data (Optional)

You can create sample trials and publications using the API docs:

1. Visit **http://localhost:8000/docs**
2. Try these endpoints:
   - `POST /api/users/signup` - Create a researcher
   - `POST /api/trials/` - Create a trial
   - `POST /api/publications/` - Create a publication

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** `fastapi` not found
```powershell
pip install fastapi uvicorn sqlalchemy pydantic
```

**Problem:** Port 8000 already in use
```powershell
# Kill the process using port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Frontend Issues

**Problem:** `vite` command not found
```powershell
npm install
```

**Problem:** Port 5173 already in use
- Vite will automatically try port 5174

**Problem:** Tailwind styles not loading
```powershell
npm install -D tailwindcss postcss autoprefixer
```

---

## 📖 Next Steps

- Read the full **README.md** for detailed documentation
- Explore the **API documentation** at http://localhost:8000/docs
- Check out the **code structure** in the project folders
- Customize the design and features for your needs

---

## 🎨 Features to Try

✅ Patient onboarding flow
✅ Browse clinical trials with filters
✅ AI-powered summarization
✅ Forum discussions
✅ Save favorites
✅ Researcher dashboard
✅ Create trials and publications
✅ Responsive mobile design

---

**Enjoy CuraLink! 🏥**
