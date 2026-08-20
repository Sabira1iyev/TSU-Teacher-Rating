import requests

payload = {
    "history": [{"role": "user", "text": "Ben kimim?"}],
    "user": {
        "firstName": "Ali",
        "lastName": "Veli",
        "faculty": "Muhendislik",
        "studyYear": "3"
    }
}
try:
    response = requests.post("http://127.0.0.1:8000/api/chat", json=payload)
    print("STATUS:", response.status_code)
    print("REPLY:", response.json())
except Exception as e:
    print("ERROR:", str(e))
