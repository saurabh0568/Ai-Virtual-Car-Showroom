from fastapi import FastAPI, WebSocket
import asyncio

app = FastAPI()

async def ai_response_stream(user_input: str):
    """Simulate real-time AI response streaming"""
    responses = {
        "hi": "Hello! How can I assist you today?",
        "how are you": "I'm just a bot, but I'm here to help! 🚗",
        "tell me about SUVs": "SUVs are spacious and great for family trips! 🚙",
    }
    response_text = responses.get(user_input.lower(), "I'm here to assist! Ask about sedans, SUVs, financing, or test drives.")
    
    for word in response_text.split():
        yield word + " "
        await asyncio.sleep(0.2)  # Simulate typing delay

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        async for word in ai_response_stream(data):
            await websocket.send_text(word)
