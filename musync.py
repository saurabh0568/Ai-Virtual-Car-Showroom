from flask import Flask, render_template
from flask_socketio import SocketIO, join_room, emit

app = Flask(__name__, static_folder='public', template_folder='public')
app.secret_key = b'n#,\xb9c\xe7M\xba\xd1H\x91s\xbf\x9e=\xca4M `\xc2\xd76\xf2'
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')  # This will load index.html from the 'public' folder

@app.route('/room/<room_id>')
def room(room_id):
    return render_template('cars.html', room_id=room_id)  # This will load cars.html from the 'public' folder

# When a user joins the room
@socketio.on('join')
def handle_join(data):
    room = data['room']
    join_room(room)
    print(f"User joined room: {room}")

# Sync event for collaborative actions (e.g., scrolling, filters, chat)
@socketio.on('sync_action')
def handle_sync_action(data):
    room = data['room']
    action = data['action']
    emit('sync_action', {'action': action, 'data': data['data']}, room=room, include_self=False)

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5500)
