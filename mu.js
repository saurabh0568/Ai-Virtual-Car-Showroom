const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public')); // where collab.js lives

io.on('connection', (socket) => {
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('chat-message', { user: 'System', message: 'A friend joined!' });
  });

  socket.on('chat-message', (data) => {
    io.to(data.roomId).emit('chat-message', data);
  });

  socket.on('scroll', (data) => {
    socket.to(data.roomId).emit('scroll', data.scrollY);
  });

  socket.on('filters-updated', (data) => {
    socket.to(data.roomId).emit('filters-updated', data);
  });
  
  socket.on('button-clicked', (data) => {
    socket.to(data.roomId).emit('button-clicked', data);
  });

  socket.on('chatbot-opened', (data) => {
    socket.to(data.roomId).emit('chatbot-opened');
  });
  
  socket.on('chatbot-closed', (data) => {
    socket.to(data.roomId).emit('chatbot-closed');
  });
  
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000/');
});
