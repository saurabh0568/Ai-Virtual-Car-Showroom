from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json
from typing import Dict, List, Optional

app = FastAPI()

# Allow CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.usernames: Dict[str, str] = {}

    async def connect(self, websocket: WebSocket, user_id: str, username: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        self.usernames[user_id] = username
        await self.broadcast_user_count()

    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
        if user_id in self.usernames:
            del self.usernames[user_id]

    async def update_username(self, user_id: str, username: str):
        self.usernames[user_id] = username

    async def broadcast_user_count(self):
        count = len(self.active_connections)
        await self.broadcast(json.dumps({
            "type": "user_count",
            "count": count
        }))

    async def broadcast(self, message: str):
        for connection in self.active_connections.values():
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    user_id = None
    
    try:
        await websocket.accept()
        
        while True:
            data = await websocket.receive_text()
            
            try:
                json_data = json.loads(data)
                
                if 'type' in json_data:
                    if json_data['type'] == 'user_connected':
                        user_id = json_data['userId']
                        username = json_data['username']
                        await manager.connect(websocket, user_id, username)
                    
                    elif json_data['type'] == 'username_change':
                        user_id = json_data['userId']
                        username = json_data['username']
                        await manager.update_username(user_id, username)
                    
                    elif json_data['type'] == 'chat_message':
                        user_id = json_data['userId']
                        username = json_data['username']
                        message = json_data['message']
                        
                        # Broadcast the message to all connected clients
                        await manager.broadcast(json.dumps({
                            "type": "chat_message",
                            "userId": user_id,
                            "username": username,
                            "message": message
                        }))
                        
                        # If AI is enabled, you might want to generate a response here
                        # and broadcast it as a bot response
                        
                        # Example bot response (hardcoded for demonstration)
                        # await manager.broadcast(json.dumps({
                        #     "type": "bot_response",
                        #     "message": "This is a demo bot response"
                        # }))
            
            except json.JSONDecodeError:
                # Handle plain text messages (backward compatibility)
                await manager.broadcast(data)
    
    except WebSocketDisconnect:
        if user_id:
            manager.disconnect(user_id)
            await manager.broadcast_user_count()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)