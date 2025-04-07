from flask import Flask, render_template
from flask_socketio import SocketIO, join_room, leave_room, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app, cors_allowed_origins="*")

# Serve the showroom page
@app.route('/')
def index():
    return render_template('lobby.html')

# Handle user joining a room
@socketio.on('join_room')
def join(data):
    room = data['room']
    join_room(room)
    emit('message', f'User joined room {room}', room=room)

# Handle user leaving a room
@socketio.on('leave_room')
def leave(data):
    room = data['room']
    leave_room(room)
    emit('message', f'User left room {room}', room=room)

# Handle real-time browsing actions
@socketio.on('sync_action')
def sync_action(data):
    room = data['room']
    action_type = data['action']
    value = data['value']

    # Broadcast the action to all users in the room
    emit('sync_action', {"action": action_type, "value": value}, room=room, include_self=False)

if __name__ == '__main__':
    socketio.run(app, debug=True)
