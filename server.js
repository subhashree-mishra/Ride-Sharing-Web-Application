const express = require('express');
const http = require('http');
const readline = require('readline'); // Import readline to read terminal input
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Your client URL
    methods: ["GET", "POST"],
  },
});

// Set up readline to get input from the terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to send a message from the terminal
const sendServerMessage = () => {
  rl.question('Enter message to send: ', (input) => {
    const message = { user: 'Server', text: input };
    io.emit('receiveMessage', message); // Broadcast the message to all clients
    sendServerMessage(); // Allow continuous input
  });
};

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // Listen for messages sent by clients
  socket.on('sendMessage', (message) => {
    console.log('Message received:', message);

    // Broadcast the message to all connected clients, including the sender
    io.emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(4000, () => {
  console.log('Server is running on port 4000');
  sendServerMessage(); // Start listening for terminal input
});
