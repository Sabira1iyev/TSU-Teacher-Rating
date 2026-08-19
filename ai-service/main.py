from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
async def chat(request: ChatRequest):
    user_message = request.message

    if "hoca".lower() in user_message.lower() or "ders".lower() in user_message.lower():
        reply = "TSU'da hoca ve ders seçimleri çok önemlidir. Henüz veritabanına bağlanmadım ama yakında sana en iyi hocaları önereceğim!"
    else:
        reply = f"sen '{user_message}' dedin. bir sey yapamam simdilik"
    
    return {"reply": reply}