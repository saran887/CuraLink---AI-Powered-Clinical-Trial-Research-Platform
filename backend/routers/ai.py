"""
AI router - Google Gemini AI integration for summarization and NLP
"""
from fastapi import APIRouter, HTTPException
from schemas import SummarizeRequest, SummarizeResponse
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

router = APIRouter()

# Configure Gemini API
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if GOOGLE_API_KEY and GOOGLE_API_KEY != "your-api-key-here":
    genai.configure(api_key=GOOGLE_API_KEY)
    model = genai.GenerativeModel('gemini-2.5-flash')  # Latest fast model
else:
    model = None
    print("⚠️ WARNING: GOOGLE_API_KEY not configured. AI features will use fallback mode.")


@router.post("/summarize", response_model=SummarizeResponse)
async def summarize_text(request: SummarizeRequest):
    """
    AI-powered text summarization using Google Gemini
    Falls back to simple summarization if API key not configured
    """
    if model is None:
        # Fallback to simple summarization
        text = request.text
        if len(text) > 100:
            summary = text[:100] + "..."
        else:
            summary = text
        return SummarizeResponse(summary=f"📝 Summary: {summary}")
    
    try:
        # Use Gemini AI for summarization
        prompt = f"""You are a medical expert assistant. Summarize the following medical/scientific text in simple, patient-friendly language. 
        Keep it concise (2-3 sentences maximum) and focus on the key findings or main points.
        
        Text to summarize:
        {request.text}
        """
        
        response = model.generate_content(prompt)
        summary = response.text.strip()
        
        return SummarizeResponse(summary=summary)
    
    except Exception as e:
        print(f"Gemini API error: {str(e)}")
        # Fallback on error
        text = request.text
        summary = text[:150] + "..." if len(text) > 150 else text
        return SummarizeResponse(summary=f"📝 {summary}")


@router.post("/extract-conditions")
async def extract_conditions_from_symptoms(symptoms: str):
    """
    Extract medical conditions from natural language symptoms
    Use this in patient onboarding to auto-detect conditions
    """
    if model is None:
        return {
            "conditions": "Please configure GOOGLE_API_KEY",
            "original_symptoms": symptoms,
            "confidence": "low"
        }
    
    try:
        prompt = f"""You are a medical AI assistant. Based on the following patient symptoms, identify the most likely medical condition(s).
        Return ONLY the condition name(s), comma-separated. Be specific but concise.
        If multiple conditions are possible, list the most likely one first.
        
        Patient symptoms: {symptoms}
        
        Format: Just the condition name(s), nothing else.
        Example: "Type 2 Diabetes" or "Hypertension, Cardiovascular disease"
        """
        
        response = model.generate_content(prompt)
        conditions = response.text.strip()
        
        return {
            "conditions": conditions,
            "original_symptoms": symptoms,
            "confidence": "high"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Condition extraction failed: {str(e)}")


@router.post("/match-experts")
async def ai_match_experts(condition: str, symptoms: str = ""):
    """
    AI-powered expert matching based on condition and symptoms
    Returns recommended medical specialties to search for
    """
    if model is None:
        return {
            "recommended_specialties": "Oncologist, Cardiologist, Endocrinologist",
            "explanation": "Please configure GOOGLE_API_KEY for AI-powered recommendations",
            "confidence": "low"
        }
    
    try:
        prompt = f"""You are a medical expert matcher. Given a patient's condition and symptoms, recommend the top 3 medical specialties that would be most relevant.
        
        Condition: {condition}
        Symptoms: {symptoms if symptoms else 'Not provided'}
        
        Return your answer in this exact format:
        Specialties: [specialty1], [specialty2], [specialty3]
        Explanation: [Brief 1-sentence explanation of why these specialties]
        """
        
        response = model.generate_content(prompt)
        result = response.text.strip()
        
        # Parse the response
        lines = result.split('\n')
        specialties = ""
        explanation = ""
        
        for line in lines:
            if line.startswith("Specialties:"):
                specialties = line.replace("Specialties:", "").strip()
            elif line.startswith("Explanation:"):
                explanation = line.replace("Explanation:", "").strip()
        
        if not specialties:
            specialties = result  # Fallback if format not followed
        
        return {
            "recommended_specialties": specialties,
            "explanation": explanation if explanation else "AI-generated recommendations",
            "confidence": "high"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Expert matching failed: {str(e)}")


@router.post("/analyze-eligibility")
async def analyze_trial_eligibility(
    patient_age: int,
    patient_condition: str,
    patient_symptoms: str,
    trial_criteria: str
):
    """
    AI-powered trial eligibility analysis
    Determines if patient likely meets trial criteria
    """
    if model is None:
        return {
            "eligible": "unknown",
            "explanation": "Please configure GOOGLE_API_KEY",
            "confidence": "low"
        }
    
    try:
        prompt = f"""You are a clinical trial eligibility analyzer. Based on the patient information and trial criteria, determine if the patient is likely eligible.
        
        Patient Information:
        - Age: {patient_age}
        - Condition: {patient_condition}
        - Symptoms: {patient_symptoms}
        
        Trial Eligibility Criteria:
        {trial_criteria}
        
        Answer in this format:
        Eligible: [Yes/No/Maybe]
        Explanation: [Brief explanation why]
        """
        
        response = model.generate_content(prompt)
        result = response.text.strip()
        
        # Parse response
        eligible = "maybe"
        explanation = result
        
        if "Eligible: Yes" in result or "Eligible:Yes" in result:
            eligible = "yes"
        elif "Eligible: No" in result or "Eligible:No" in result:
            eligible = "no"
        
        # Extract explanation
        if "Explanation:" in result:
            explanation = result.split("Explanation:")[-1].strip()
        
        return {
            "eligible": eligible,
            "explanation": explanation,
            "confidence": "medium"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Eligibility analysis failed: {str(e)}")


@router.get("/health")
def ai_health():
    """
    Check AI service health and configuration
    """
    api_configured = model is not None
    
    return {
        "status": "healthy" if api_configured else "degraded",
        "service": "Google Gemini Pro AI",
        "version": "2.0.0",
        "api_configured": api_configured,
        "capabilities": [
            "Text summarization (medical content)",
            "Condition extraction from symptoms",
            "Expert specialty matching",
            "Trial eligibility analysis"
        ],
        "fallback_mode": not api_configured
    }
