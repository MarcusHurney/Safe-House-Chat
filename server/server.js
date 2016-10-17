const path = require('path');
const http = require('http');
const publicPath = path.join(__dirname, '../public');
const socketIO = require('socket.io');

const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();

const server = http.createServer(app);
const io = socketIO(server);
const { generateMessage } = require('./utilities/message');

app.use(express.static(publicPath));

io.on('connection', socket => {
  console.log("New user connected");

  socket.on('disconnect', () => {
    console.log("Client disconnected");
  });

  // socket.emit sends the message once to the new user
  // who just joined the socket
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to Safe House Chat'));

  // socket.broadcast.emit sends the message to everyone but yourself
  // this is a way for everyone to know you just joined the socket
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'Your guest has arrived'));

  socket.on('createMessage', (message) => {
    socket.broadcast.emit('newMessage', generateMessage(message.from, message.text));
  });

});

server.listen(PORT, () => {
  console.log("Server is available on port 3000");
});
