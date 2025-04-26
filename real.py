import asyncio
import websockets
import google.generativeai as ai

# Configure the Google Generative AI API
API_KEY = 'AIzaSyDryvfzmXv0MzjBN3myX3O6fyGgp3QJrTc'
ai.configure(api_key=API_KEY)

# Create a context that will be used to provide car knowledge to the model
CAR_SHOWROOM_CONTEXT = """
You are an automotive expert working for S2 CarHub, a premium car dealership. Your role is to assist customers with questions about our vehicles, financing options, and the car buying process.

Our inventory includes:
- Sedans: Luxury S1 (RS. 135,000, 28 mpg), Economy E3 (RS. 122,000, 38 mpg), Sport GT (RS. 142,000, 25 mpg)
- SUVs: Family XL (RS. 138,000, 24 mpg), Compact C2 (RS. 128,000, 32 mpg), Luxury LX (RS. 152,000, 22 mpg)
- Electric Vehicles: EV Prime (RS. 145,000, 310 mile range), EV Sport (RS. 165,000, 280 mile range), EV City (RS. 132,000, 220 mile range)

We offer financing options:
- Loans: Starting at 3.9% APR, 36-72 month terms, requires 650+ credit score
- Leases: Starting at $299/month, 24-48 month terms, requires 680+ credit score
- Cashback: Up to $3,000 on select models, cannot be combined with special financing

Common services:
- Test drives available in-person and virtual
- All new vehicles have 3-year/36,000-mile basic warranty and 5-year/60,000-mile powertrain warranty
- Trade-ins accepted with competitive valuation
- Home delivery within 50 miles
- Vehicle customization options available

Keep your responses conversational, helpful, and focused on answering the customer's specific questions.
"""

# Store active chat sessions
active_chats = {}

async def handle_websocket(websocket):
    """Handle WebSocket connections and messages"""
    # Generate a unique session ID for this connection
    session_id = id(websocket)
    print(f"New connection established: {session_id}")
    
    # Initialize a new chat for this session
    try:
        model = ai.GenerativeModel("gemini-1.5-pro")
        active_chats[session_id] = model.start_chat(history=[
            {"role": "user", "parts": [CAR_SHOWROOM_CONTEXT]},
            {"role": "model", "parts": ["I understand my role as an automotive expert for S2 CarHub. I'll provide helpful information about your vehicle inventory, financing options, and services while keeping my responses conversational and focused on customer questions."]}
        ])
        
        async for message in websocket:
            try:
                # Process the message
                user_message = message.strip()
                print(f"Received message: {user_message}")
                
                # Handle exit command
                if user_message.lower() == 'bye':
                    await websocket.send('Goodbye! Feel free to return if you have more questions about our vehicles.')
                    continue
                
                # Get response from AI
                response = active_chats[session_id].send_message(user_message)
                
                # Send the response back to the client
                await websocket.send(response.text)
                print(f"Sent response for message: {user_message}")
                
            except Exception as e:
                # Handle any errors in processing
                print(f"Error processing message: {e}")
                await websocket.send(f"I'm sorry, I encountered an error while processing your request. Please try again or ask a different question.")
    
    except websockets.exceptions.ConnectionClosed:
        print(f"Connection closed for session {session_id}")
    except Exception as e:
        print(f"Error in handle_websocket: {e}")
    finally:
        # Clean up when the connection is closed
        if session_id in active_chats:
            del active_chats[session_id]
            print(f"Cleaned up session {session_id}")

async def main():
    """Start the WebSocket server"""
    print("Starting WebSocket server on ws://localhost:8000")
    
    # Start the server with minimal configuration
    server = await websockets.serve(handle_websocket, "localhost", 8000)
    print("Server started successfully")
    
    # Keep the server running
    await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())