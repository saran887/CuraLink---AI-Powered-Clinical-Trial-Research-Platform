# 🤖 AI Implementation Guide for CuraLink

## Current Status

### ✅ **What's Already Implemented (Mock AI)**

Your CuraLink platform currently has **basic AI infrastructure** in place:

1. **Backend AI Router** (`backend/routers/ai.py`)
   - Mock summarization endpoint
   - Simple text truncation (first 100 chars)
   - Returns placeholder AI summaries

2. **Frontend Integration**
   - "✨ Summarize" buttons in Card component
   - Integrated in Patient Dashboard for trials/publications
   - Shows loading states during summarization

3. **Use Cases Currently Supported**
   - Summarize clinical trial descriptions
   - Summarize publication abstracts
   - Placeholder for real AI processing

---

## 🚀 **What You Can Add for Production AI**

### **Option 1: OpenAI GPT Integration** (Recommended)

#### **Step 1: Install OpenAI Library**
```bash
cd backend
pip install openai==1.3.0
pip freeze > requirements.txt
```

#### **Step 2: Update `backend/routers/ai.py`**

```python
"""
AI router - OpenAI GPT integration for summarization and NLP
"""
from fastapi import APIRouter, HTTPException
from schemas import SummarizeRequest, SummarizeResponse
import openai
import os

router = APIRouter()

# Initialize OpenAI (add your API key to .env file)
openai.api_key = os.getenv("OPENAI_API_KEY")


@router.post("/summarize", response_model=SummarizeResponse)
async def summarize_text(request: SummarizeRequest):
    """
    AI-powered text summarization using GPT-4
    """
    try:
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": "You are a medical expert assistant. Summarize the following medical content in simple, patient-friendly language. Keep it concise (2-3 sentences)."
                },
                {
                    "role": "user",
                    "content": request.text
                }
            ],
            max_tokens=150,
            temperature=0.5
        )
        
        summary = response.choices[0].message.content
        return SummarizeResponse(summary=summary)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI summarization failed: {str(e)}")


@router.post("/extract-conditions")
async def extract_conditions_from_symptoms(symptoms: str):
    """
    Extract medical conditions from natural language symptoms
    Use this in patient onboarding to auto-detect conditions
    """
    try:
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": "Extract the primary medical condition(s) from the patient's symptom description. Return only the condition name(s), comma-separated."
                },
                {
                    "role": "user",
                    "content": f"Patient symptoms: {symptoms}"
                }
            ],
            max_tokens=50,
            temperature=0.3
        )
        
        conditions = response.choices[0].message.content.strip()
        return {"conditions": conditions, "original_symptoms": symptoms}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Condition extraction failed: {str(e)}")


@router.post("/match-experts")
async def ai_match_experts(condition: str, symptoms: str):
    """
    AI-powered expert matching based on condition and symptoms
    Returns recommended specialties to search for
    """
    try:
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": "You are a medical expert matcher. Given a condition and symptoms, recommend the top 3 medical specialties that would be most relevant."
                },
                {
                    "role": "user",
                    "content": f"Condition: {condition}\\nSymptoms: {symptoms}"
                }
            ],
            max_tokens=100,
            temperature=0.4
        )
        
        specialties = response.choices[0].message.content.strip()
        return {"recommended_specialties": specialties}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Expert matching failed: {str(e)}")


@router.get("/health")
def ai_health():
    """
    Check AI service health
    """
    return {
        "status": "healthy",
        "service": "OpenAI GPT Integration",
        "version": "2.0.0",
        "capabilities": [
            "Text summarization",
            "Condition extraction from symptoms",
            "Expert specialty matching"
        ]
    }
```

#### **Step 3: Create Environment File**
```bash
# Create backend/.env
OPENAI_API_KEY=your-api-key-here
DATABASE_URL=sqlite:///./curalink.db
```

#### **Step 4: Update Frontend API Service**

Add to `frontend/src/services/api.js`:

```javascript
// AI - Extract conditions from symptoms
export const extractConditions = async (symptoms) => {
  const response = await api.post('/ai/extract-conditions', { symptoms });
  return response.data;
};

// AI - Get expert specialty recommendations
export const matchExperts = async (condition, symptoms) => {
  const response = await api.post('/ai/match-experts', { condition, symptoms });
  return response.data;
};
```

#### **Step 5: Enhance Patient Onboarding with AI**

Update `frontend/src/pages/PatientOnboard.jsx`:

```javascript
// Add AI condition extraction
const [extractedCondition, setExtractedCondition] = useState('');

const handleSymptomAnalysis = async () => {
  if (!formData.symptoms) return;
  
  try {
    const result = await api.extractConditions(formData.symptoms);
    setExtractedCondition(result.conditions);
    
    // Auto-fill condition if empty
    if (!formData.condition) {
      setFormData({ ...formData, condition: result.conditions });
    }
    
    setToast({ message: 'AI detected: ' + result.conditions, type: 'success' });
  } catch (error) {
    console.error('AI extraction failed:', error);
  }
};

// Add button in symptoms section
<button
  type="button"
  onClick={handleSymptomAnalysis}
  className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-lg"
>
  🤖 AI: Detect Condition
</button>
```

---

### **Option 2: Hugging Face Transformers** (Free Alternative)

#### **Step 1: Install Transformers**
```bash
pip install transformers==4.35.0 torch==2.1.0
```

#### **Step 2: Update `ai.py` with Open-Source Models**

```python
from transformers import pipeline

# Initialize summarization pipeline (one-time load)
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

@router.post("/summarize", response_model=SummarizeResponse)
async def summarize_text(request: SummarizeRequest):
    """
    Summarize using BART model from Hugging Face
    """
    try:
        # BART works best with 100-1000 word inputs
        result = summarizer(request.text, max_length=100, min_length=30, do_sample=False)
        summary = result[0]['summary_text']
        return SummarizeResponse(summary=summary)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

**Pros:** Free, no API keys needed  
**Cons:** Requires more RAM, slower, less accurate than GPT-4

---

### **Option 3: Google Gemini API** (Cost-Effective)

```bash
pip install google-generativeai==0.3.0
```

```python
import google.generativeai as genai

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-pro')

@router.post("/summarize")
async def summarize_text(request: SummarizeRequest):
    response = model.generate_content(
        f"Summarize this medical text in 2-3 sentences: {request.text}"
    )
    return SummarizeResponse(summary=response.text)
```

---

## 🎯 **Use Cases to Implement**

### **1. Smart Symptom Analysis** (Patient Onboarding)
- Patient enters: *"I have chest pain and shortness of breath"*
- AI extracts: *"Cardiac condition, potential angina or heart disease"*
- Auto-suggests: Search for Cardiologists

### **2. Publication Summarization** (Patient Dashboard)
- Long medical abstract → Plain English summary
- Technical terms → Patient-friendly language
- Highlight key findings

### **3. Expert Matching** (Health Experts Page)
- Patient condition + symptoms → AI recommends best specialties
- Ranking experts by relevance
- Personalized recommendations

### **4. Trial Eligibility Check** (Future Feature)
- Patient profile + Trial criteria → AI determines if eligible
- Explains why eligible/not eligible
- Suggests similar trials

### **5. Forum Auto-Reply** (Future Feature)
- AI-powered suggestions for researcher replies
- Summarize long threads
- Related posts suggestions

---

## 💰 **Cost Comparison**

| Service | Model | Cost per 1K tokens | Best For |
|---------|-------|-------------------|----------|
| OpenAI | GPT-4 | $0.03 (input) | Highest accuracy |
| OpenAI | GPT-3.5-Turbo | $0.0015 | Balanced cost/quality |
| Google | Gemini Pro | $0.00025 | Most cost-effective |
| Hugging Face | BART/T5 | FREE | Budget/privacy |

---

## 🔧 **Implementation Priority**

### **Phase 1: Quick Wins** (1-2 hours)
1. ✅ OpenAI API integration in `ai.py`
2. ✅ Enhanced summarization (already has UI)
3. ✅ Add condition extraction endpoint

### **Phase 2: Smart Onboarding** (2-3 hours)
1. ✅ AI button in patient onboarding
2. ✅ Auto-detect condition from symptoms
3. ✅ Show confidence/suggestions

### **Phase 3: Advanced Features** (1 day)
1. ✅ Expert matching algorithm
2. ✅ Trial eligibility checker
3. ✅ Forum reply suggestions

---

## 📝 **Example API Keys Setup**

Create `backend/.env`:
```env
# OpenAI (get from: https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx

# Google Gemini (get from: https://makersuite.google.com/app/apikey)
GOOGLE_API_KEY=AIzaSyxxxxxxxxxxxxx

# Hugging Face (optional, for private models)
HUGGINGFACE_TOKEN=hf_xxxxxxxxxxxxx
```

---

## 🚨 **Important Security Notes**

1. **Never commit .env files** - Add to `.gitignore`
2. **Use environment variables** in production
3. **Rate limit AI endpoints** to prevent abuse
4. **Cache AI responses** to reduce API costs
5. **Add user authentication** before enabling AI

---

## 📊 **Expected Results**

### **Before AI:**
- Manual condition entry
- Generic expert search
- No content summarization
- Long abstracts hard to read

### **After AI:**
- ✨ Auto-detect conditions from symptoms
- 🎯 Smart expert recommendations
- 📝 One-click summaries
- 🤖 Patient-friendly explanations
- 💡 Personalized trial matching

---

## 🎓 **Recommended Path**

For your hackathon, I recommend:

1. **Start with OpenAI GPT-3.5-Turbo** (fast, cheap, good quality)
2. **Implement 3 features:**
   - ✅ Enhanced summarization (upgrade existing mock)
   - ✅ Symptom → Condition extraction (patient onboarding)
   - ✅ Expert specialty matching (health experts page)

3. **Demo Flow:**
   - Patient enters symptoms → AI detects condition
   - Auto-searches relevant trials/publications
   - Shows summaries with one click
   - Recommends best experts to connect with

---

## 🔗 **Get API Keys**

- **OpenAI:** https://platform.openai.com/api-keys
- **Google Gemini:** https://makersuite.google.com/app/apikey
- **Hugging Face:** https://huggingface.co/settings/tokens

---

## 💡 **Quick Start Command**

```bash
# Option 1: OpenAI (Recommended)
cd backend
pip install openai==1.3.0
echo "OPENAI_API_KEY=your-key-here" > .env

# Option 2: Free Alternative
pip install transformers torch

# Then update ai.py with code from above
```

---

**Need help implementing? Ask me to:**
- "Add OpenAI integration to ai.py"
- "Create symptom extraction feature"
- "Build expert matching algorithm"
- "Enhance patient onboarding with AI"

