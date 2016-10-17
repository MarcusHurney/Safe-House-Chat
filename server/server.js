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
});

server.listen(PORT, () => {
  console.log("Server is available on port 3000");
});
