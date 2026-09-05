from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import google.generativeai as genai
import requests
from typing import Optional
import requests

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


def get_professor_details():
    """
    Retrieves the names, faculties, and ratings of all professors from the database.
    """
    url = "https://tsuratingteacher.vercel.app/api/professors"

    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    return {"error": "Failed to fetch professor data"}


def get_professors_by_id(professor_id: str):
    """
    Retrieves detailed information (including ALL student reviews, comments, and trend data)
    for a SPESIFIC professor by their ID. Use this when the user asks for reviews, comments, or detailed analytics of a specific professor.
    """
    url = f"https://tsuratingteacher.vercel.app/api/professors/{professor_id}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    return {"error": "Failed to fetch professor data"}


app = FastAPI()


@app.get("/")
async def health_check():
    return {"status": "alive"}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    history: list[dict]
    user: Optional[dict] = None


@app.post("/api/chat")
async def chat(request: ChatRequest, x_internal_secret: str = Header(None)):
    try:
        if x_internal_secret != os.getenv("INTERNAL_API_SECRET"):
            raise HTTPException(status_code=403, detail="Forbidden")
        user_info_text = ""
        if request.user:
            name = request.user.get("firstName", "")
            surname = request.user.get("lastName", "")
            faculty = request.user.get("faculty", "")
            studyYear = request.user.get("studyYear", "")
            user_info_text = f"\nCRITICAL RULE 3: The person you are talking to is named {name} {surname}. Faculty:{faculty}. Year:{studyYear}. If they ask who they are or about their profile, answer sincerely using this exact information."

        model = genai.GenerativeModel(
            "gemini-3.5-flash",
            system_instruction=f"""
   You are the smart and friendly AI assistant for "ProfRate", a platform where Tbilisi State University students rate and
   review university teacher and courses.
   Your name: "Prof AI".
   Your personality: Helpful, brief, honest, direct, professional and very friendly (like a fellow student).

   CRITICAL RULE 1: Always auto-detect the user's language (it will be English, Azerbaijani, Turkish or Georgian) and reply in
   the EXACT SAME LANGUAGE the user wrote to you. Never mix languages. Keep answers short.

   CRITICAL RULE 2: If the user asks about a teacher or professor, or recommendation, you MUST call the "get_professor_details" tool. DO NOT invent or make
   up any teachers that are not in the tool's response. If a teacher is not listed in the tool response, explicitly say "This teacher is not in our database." 
   {user_info_text}
   """,
            tools=[get_professor_details, get_professors_by_id],
        )
        formatted_history = []
        for msg in request.history[:-1]:
            gemini_role = "model" if msg["role"] == "bot" else "user"
            formatted_history.append({"role": gemini_role, "parts": [msg["text"]]})

        last_message = request.history[-1]["text"]

        chat_session = model.start_chat(
            history=formatted_history, enable_automatic_function_calling=True
        )
        response = chat_session.send_message(last_message)

        return {"reply": response.text}
    except Exception as e:
        return {"reply": f"Error:{str(e)}"}
