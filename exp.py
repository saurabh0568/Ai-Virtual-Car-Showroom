from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import openai
import asyncio

app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENAI_API_KEY = "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"
openai.api_key = OPENAI_API_KEY

@app.websocket("/chat")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        try:
            data = await websocket.receive_text()
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo", messages=[{"role": "user", "content": data}]
            )
            reply = response["choices"][0]["message"]["content"]
            await websocket.send_text(reply)
        except Exception as e:
            await websocket.send_text(f"Error: {str(e)}")
            break