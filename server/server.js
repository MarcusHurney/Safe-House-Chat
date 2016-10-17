const path = require('path');
const http = require('http');
const publicPath = path.join(__dirname, '../public');
const socketIO = require('socket.io');

const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();

const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', socket => {
  console.log("New user connected");

  socket.on('disconnect', () => {
    console.log("Client disconnected");
  });

  // socket.emit sends the message once to the new user
  // who just joined the socket
  socket.emit('newMessage', {
    from: 'Admin',
    text: 'Welcome to Safe House Chat Application',
    createdAt: new Date().getTime()
  });

  // socket.broadcast.emit sends the message to everyone but yourself
  // this is a way for everyone to know you just joined the socket
  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: 'Your guest has arrived',
    createdAt: new Date().getTime()
  });

  socket.on('createMessage', (message) => {
    console.log("Here is your message from the client ", message);
    socket.broadcast.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });
  });

});

server.listen(PORT, () => {
  console.log("Server is available on port 3000");
});
