from backend.config import settings
from google import genai

API_KEY = settings.GEMINI_API_KEY
print(f"API Key loaded: {API_KEY[:10] if API_KEY else 'None'}...")
client = genai.Client(api_key=API_KEY)
