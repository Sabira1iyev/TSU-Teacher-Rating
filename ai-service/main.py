from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import os
from dotenv import load_dotenv
import requests

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    history: list[dict]
    user: dict = Field(default_factory=dict)
    professors: list[dict] = Field(default_factory=list)


@app.get("/")
async def health_check():
    return {"status": "alive"}


def professor_context(professors: list[dict]) -> str:
    rows = []
    for professor in professors:
        department = professor.get("departments") or {}
        if isinstance(department, list):
            department = department[0] if department else {}
        courses = professor.get("courses") or []
        rows.append({
            "id": professor.get("id"),
            "name": " ".join(part for part in [professor.get("first_name"), professor.get("last_name")] if part),
            "title": professor.get("title"),
            "rating": professor.get("average_rating"),
            "review_count": professor.get("review_count"),
            "department": department.get("name", "") if isinstance(department, dict) else "",
            "courses": [course.get("name") for course in courses if isinstance(course, dict)],
        })
    return "\nPROFESSOR DATABASE (authoritative; total records: {}):\n{}".format(
        len(rows), rows
    )


@app.post("/api/chat")
async def chat(request: ChatRequest, x_internal_secret: str = Header(None)):
    if not os.getenv("INTERNAL_API_SECRET") or x_internal_secret != os.getenv("INTERNAL_API_SECRET"):
        raise HTTPException(status_code=403, detail="Forbidden")

    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="Claude API key is not configured")
    if not request.history:
        raise HTTPException(status_code=400, detail="Message history is required")

    user = request.user or {}
    user_name = " ".join(part for part in [user.get("firstName"), user.get("lastName")] if part).strip()
    profile_context = (
        f"\nAUTHENTICATED USER PROFILE: Name: {user_name or 'not provided'}; "
        f"Faculty: {user.get('faculty') or 'not provided'}; "
        f"Study year: {user.get('studyYear') or 'not provided'}. "
        "Use this profile when asked who the user is; never claim you were not told if a value is present."
    )
    system_prompt = (
        'You are Prof AI, the friendly assistant for ProfRate, a platform where Tbilisi State University '
        'students review professors and courses. Reply briefly in the same language as the latest user '
        'message (English, Azerbaijani, Turkish, or Georgian). Be accurate and do not invent facts. '
        'For professor questions, use only the supplied database. The total professor count is the number '
        'of records in that database; answer count questions directly without estimating. If a professor '
        'is absent, say they are not in the database.\n'
        + profile_context
        + professor_context(request.professors)
    )
    messages = []
    for item in request.history[-10:]:
        if item.get("role") not in ("user", "bot") or not isinstance(item.get("text"), str):
            continue
        role = "assistant" if item["role"] == "bot" else "user"
        if not messages and role == "assistant":
            continue
        if messages and messages[-1]["role"] == role:
            messages[-1]["content"] += "\n" + item["text"]
        else:
            messages.append({"role": role, "content": item["text"]})
    if not messages or messages[-1]["role"] != "user":
        raise HTTPException(status_code=400, detail="Latest message must be from the user")

    try:
        response = requests.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": api_key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json={
                "model": os.getenv("ANTHROPIC_MODEL", "claude-sonnet-4-6"),
                "max_tokens": 700,
                "system": system_prompt,
                "messages": messages,
            },
            timeout=45,
        )
        response.raise_for_status()
        payload = response.json()
        reply = "".join(
            block.get("text", "") for block in payload.get("content", [])
            if block.get("type") == "text"
        ).strip()
        if not reply:
            raise ValueError("Claude returned an empty response")
        return {"reply": reply}
    except (requests.RequestException, ValueError) as error:
        print("Claude chat error:", error)
        raise HTTPException(status_code=502, detail="Claude chat service is unavailable") from error
