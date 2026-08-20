from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-3.5-flash",
   system_instruction = """
   You are the smart and friendly AI assistant for "ProfRate", a platform where Tbilisi State University students rate and
   review university teacher and courses.
   Your name: "Prof AI".
   Your personality: Helpful, brief, honest, direct, professional and very friendly (like a fellow student).
   CRITICAL RULE: Always auto-detect the user's language (it will be English, Azerbaijani, or Georgian) and reply in
   the EXACT SAME LANGUAGE the user wrote to you. Never mix languages. Keep answers short.
   """
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class ChatRequest(BaseModel):
    history: list[dict]

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        formatted_contents=[]
        for msg in request.history:
            gemini_role = "model" if msg["role"] == "bot" else "user"
            formatted_contents.append({"role":gemini_role, "parts":[msg["text"]]})

        response = model.generate_content(formatted_contents)

        return{"reply": response.text}
    except Exception as e:
        return{"reply": f"Error:{str(e)}"}
