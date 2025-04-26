const socket = io('http://localhost:3000/'); // Replace with your backend URL
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomId');
if (!roomId) {
  alert("No Room ID provided!");
  window.location.href = "/";
}
socket.emit('join-room', roomId);

socket.emit('join-room', roomId);

// 👇 Chat Box UI
const chatBox = document.createElement('div');
chatBox.innerHTML = `
  <div id="collab-chat" style="position:fixed;bottom:0;right:0;width:300px;height:200px;background:#fff;border:1px solid #aaa;z-index:9999;padding:10px;overflow:auto;">
    <div id="collab-msgs" style="height:150px;overflow-y:auto;"></div>
    <input id="collab-input" placeholder="Message..." style="width:100%;" />
  </div>`;
document.body.appendChild(chatBox);

document.getElementById('collab-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const msg = e.target.value;
    socket.emit('chat-message', { roomId, user: 'You', message: msg });
    e.target.value = '';
    addMessage(`You: ${msg}`);
  }
});

socket.on('chat-message', data => {
  addMessage(`${data.user}: ${data.message}`);
});

function addMessage(msg) {
  const msgDiv = document.createElement('div');
  msgDiv.textContent = msg;
  document.getElementById('collab-msgs').appendChild(msgDiv);
}

// 👇 Scroll Sync
window.addEventListener('scroll', () => {
  socket.emit('scroll', { roomId, scrollY: window.scrollY });
});

socket.on('scroll', (scrollY) => {
  window.scrollTo(0, scrollY);
});
