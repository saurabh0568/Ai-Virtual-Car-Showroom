const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Serve static files
app.use(express.static('public')); // Your HTML, CSS, JS in 'public' folder

// SINGLE io.on('connection')
io.on('connection', (socket) => {
    console.log('A user connected');

    // Joining a room
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });

    // Chat messaging
    socket.on('chat-message', (data) => {
        io.to(data.room).emit('chat-message', { message: data.message });
    });

    // Scroll syncing
    socket.on('scroll-sync', (data) => {
        socket.to(data.room).emit('scroll-sync', { scroll: data.scroll });
    });

    // New feature: join room (alternate)
    socket.on('join', (roomId) => {
        socket.join(roomId);
    });

    // New feature: filter syncing
    socket.on('filterChange', ({ roomId, filters }) => {
        socket.to(roomId).emit('applyFilters', { filters });
    });

    // New feature: syncing scroll position differently
    socket.on('syncScroll', ({ roomId, scrollTop }) => {
        socket.to(roomId).emit('syncScroll', { scrollTop });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start server
http.listen(5500, () => {
    console.log('Server running on http://localhost:5500');
});
