# 🚀 Google Gemini AI Setup Guide

## ✅ What's Been Configured

Your CuraLink platform now has **Google Gemini Pro AI** integrated with the following features:

### **Backend (`backend/routers/ai.py`):**
- ✅ Text summarization with Gemini Pro
- ✅ Condition extraction from natural language symptoms
- ✅ AI-powered expert specialty matching
- ✅ Trial eligibility analysis (future use)
- ✅ Automatic fallback if API key not configured

### **Frontend:**
- ✅ **Patient Onboarding** - "🤖 AI: Detect Condition" button
- ✅ **Health Experts Page** - "Get AI Expert Recommendations" button
- ✅ **Patient Dashboard** - "✨ Summarize" button (already existed)

---

## 🔑 Get Your FREE Google Gemini API Key

### **Step 1: Visit Google AI Studio**
Go to: https://makersuite.google.com/app/apikey

### **Step 2: Sign in with Google Account**
Use any Google account (Gmail)

### **Step 3: Create API Key**
1. Click **"Get API Key"** or **"Create API Key"**
2. Select a project or create a new one
3. Copy your API key (starts with `AIzaSy...`)

### **Step 4: Add to Backend**
Open `backend/.env` and replace `your-api-key-here`:

```env
# Google Gemini API Configuration
GOOGLE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Database Configuration
DATABASE_URL=sqlite:///./curalink.db

# Application Settings
DEBUG=True
```

### **Step 5: Restart Backend**
```bash
cd backend
# Stop the current server (Ctrl+C)
# Then restart:
uvicorn main:app --reload
```

---

## 💰 Pricing (Very Affordable!)

| Model | Free Tier | Paid Pricing |
|-------|-----------|--------------|
| Gemini Pro | 60 requests/min | $0.00025 per 1K tokens |
| | FREE for development! | ~$0.01 per 40 summaries |

**For hackathon/demo:** The free tier is MORE than enough!

---

## 🧪 Testing the AI Features

### **1. Test Patient Onboarding AI**
```bash
# Go to: http://localhost:5173
# Click "I'm a Patient"
# In symptoms field, type:
"I have chest pain, shortness of breath, and occasional dizziness when climbing stairs"

# Click "🤖 AI: Detect Condition"
# AI will auto-detect: "Cardiac condition, potential angina or coronary artery disease"
```

### **2. Test Health Experts AI**
```bash
# After patient onboarding
# Go to "Health Experts" page
# Click "Get AI Expert Recommendations"
# AI will suggest: "Cardiologist, Cardiac Surgeon, Interventional Cardiologist"
```

### **3. Test Summarization AI**
```bash
# On Patient Dashboard
# Click "✨ Summarize" on any trial or publication
# AI will create patient-friendly 2-3 sentence summary
```

---

## 🔍 Check if AI is Working

Visit: http://localhost:8000/api/ai/health

**Without API Key:**
```json
{
  "status": "degraded",
  "api_configured": false,
  "fallback_mode": true
}
```

**With API Key:**
```json
{
  "status": "healthy",
  "api_configured": true,
  "fallback_mode": false,
  "capabilities": [
    "Text summarization (medical content)",
    "Condition extraction from symptoms",
    "Expert specialty matching",
    "Trial eligibility analysis"
  ]
}
```

---

## 🛡️ Security Best Practices

### **1. Never Commit .env to Git**
Already added to `.gitignore`:
```gitignore
# Environment variables
.env
*.env
```

### **2. Use Different Keys for Production**
- Development: Personal API key
- Production: Separate project API key with quotas

### **3. Rate Limiting (Optional)**
Add to `ai.py` if needed:
```python
from fastapi import Depends
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@router.post("/summarize")
@limiter.limit("30/minute")  # 30 requests per minute
async def summarize_text(request: SummarizeRequest):
    # ...
```

---

## 🐛 Troubleshooting

### **Issue: "API key not configured" message**
**Solution:** Make sure `.env` file is in `backend/` folder and has correct key

### **Issue: "Resource has been exhausted"**
**Solution:** You've hit the free tier limit (60 req/min). Wait 1 minute or upgrade.

### **Issue: AI responses are slow**
**Solution:** Normal! Gemini typically takes 2-5 seconds. Show loading states.

### **Issue: ImportError: No module named 'google.generativeai'**
**Solution:** 
```bash
cd backend
pip install google-generativeai python-dotenv
```

---

## 📊 What Each AI Feature Does

### **1. Summarization (`/ai/summarize`)**
**Input:** Long medical text (trials, publications)  
**Output:** 2-3 sentence patient-friendly summary  
**Use:** Make complex medical content accessible

### **2. Condition Extraction (`/ai/extract-conditions`)**
**Input:** Natural language symptoms  
**Output:** Detected medical condition(s)  
**Use:** Auto-fill condition field during onboarding

### **3. Expert Matching (`/ai/match-experts`)**
**Input:** Patient condition + symptoms  
**Output:** Top 3 recommended medical specialties  
**Use:** Help patients find the right experts

### **4. Eligibility Analysis (`/ai/analyze-eligibility`)**
**Input:** Patient info + trial criteria  
**Output:** Yes/No/Maybe + explanation  
**Use:** Pre-screen trial eligibility

---

## 🎯 Demo Flow for Hackathon

1. **Patient Registration:**
   - Enter symptoms: "frequent urination, excessive thirst, weight loss"
   - Click AI button → Detects "Type 2 Diabetes"
   - Auto-fills condition field

2. **Expert Discovery:**
   - Navigate to Health Experts
   - Click AI recommendations → Suggests "Endocrinologist, Diabetologist, Nutritionist"
   - Search for endocrinologists

3. **Content Summarization:**
   - View clinical trials
   - Click summarize on complex trial
   - Get: "This trial tests a new insulin therapy for Type 2 Diabetes patients aged 40-65. Participants receive weekly injections for 12 weeks."

---

## 💡 Future Enhancements

- [ ] Cache AI responses in database
- [ ] Add confidence scores to AI predictions
- [ ] Multi-language support (Gemini supports 100+ languages)
- [ ] Voice input for symptoms (Web Speech API → Gemini)
- [ ] AI chatbot for patient questions
- [ ] Automated trial matching notifications

---

## 📞 Support

**Google AI Studio Docs:** https://ai.google.dev/docs  
**Gemini API Docs:** https://ai.google.dev/tutorials/python_quickstart  
**Rate Limits:** https://ai.google.dev/pricing

---

## ✨ You're All Set!

Get your API key, add it to `.env`, restart the backend, and enjoy AI-powered features!

**Test URLs:**
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- AI Health: http://localhost:8000/api/ai/health
- API Docs: http://localhost:8000/docs

