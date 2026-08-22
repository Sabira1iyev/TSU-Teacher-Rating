import google.generativeai as genai
import os
from dotenv import load_dotenv
load_dotenv("c:/Users/User/Desktop/teacherrating/ai-service/.env")
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
def get_time():
    """Returns the current time"""
    return "The time is 12:00 PM"
model = genai.GenerativeModel("gemini-3.5-flash", tools=[get_time])
chat = model.start_chat(enable_automatic_function_calling=True)
print("Sending message...")
response = chat.send_message("What time is it in one word?", stream=True)
for chunk in response:
    print("CHUNK:", chunk.text)
