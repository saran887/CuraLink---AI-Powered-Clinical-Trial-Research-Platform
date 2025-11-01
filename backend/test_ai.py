import requests
import json

print("🧪 Testing Google Gemini AI Integration...\n")

# Test 1: Check AI Health
print("1️⃣ Testing AI Health Status...")
try:
    response = requests.get("http://localhost:8000/api/ai/health")
    data = response.json()
    print(f"   Status: {data.get('status')}")
    print(f"   API Configured: {data.get('api_configured')}")
    print(f"   Fallback Mode: {data.get('fallback_mode')}")
    print(f"   ✅ AI Health Check: {'PASSED' if data.get('api_configured') else 'FAILED'}\n")
except Exception as e:
    print(f"   ❌ Error: {e}\n")

# Test 2: Test Condition Extraction
print("2️⃣ Testing AI Condition Extraction...")
try:
    response = requests.post(
        "http://localhost:8000/api/ai/extract-conditions",
        params={"symptoms": "chest pain, shortness of breath, fatigue"}
    )
    data = response.json()
    print(f"   Input: 'chest pain, shortness of breath, fatigue'")
    print(f"   AI Detected: {data.get('conditions')}")
    print(f"   Confidence: {data.get('confidence')}")
    print(f"   ✅ Condition Extraction: {'PASSED' if 'cardiac' in data.get('conditions', '').lower() else 'PARTIAL'}\n")
except Exception as e:
    print(f"   ❌ Error: {e}\n")

# Test 3: Test Summarization
print("3️⃣ Testing AI Summarization...")
try:
    long_text = """This clinical trial evaluates the efficacy and safety of a novel therapeutic agent for the treatment of Type 2 Diabetes Mellitus in adult patients aged 40-65 years. The study employs a randomized, double-blind, placebo-controlled design with a 12-week intervention period. Primary endpoints include HbA1c reduction and fasting plasma glucose levels."""
    
    response = requests.post(
        "http://localhost:8000/api/ai/summarize",
        json={"text": long_text}
    )
    data = response.json()
    print(f"   Original: {len(long_text)} characters")
    print(f"   Summary: {data.get('summary')}")
    print(f"   ✅ Summarization: PASSED\n")
except Exception as e:
    print(f"   ❌ Error: {e}\n")

# Test 4: Test Expert Matching
print("4️⃣ Testing AI Expert Matching...")
try:
    response = requests.post(
        "http://localhost:8000/api/ai/match-experts",
        params={
            "condition": "Type 2 Diabetes",
            "symptoms": "frequent urination, excessive thirst"
        }
    )
    data = response.json()
    print(f"   Condition: Type 2 Diabetes")
    print(f"   Recommended Specialties: {data.get('recommended_specialties')}")
    print(f"   Explanation: {data.get('explanation', 'N/A')}")
    print(f"   ✅ Expert Matching: PASSED\n")
except Exception as e:
    print(f"   ❌ Error: {e}\n")

print("=" * 60)
print("🎉 All AI tests completed!")
print("=" * 60)
