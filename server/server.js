const path = require('path');
const http = require('http');
const publicPath = path.join(__dirname, '../public');
const socketIO = require('socket.io');

const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();

const server = http.createServer(app);
const io = socketIO(server);

const { generateMessage, generateLocationMessage } = require('./utilities/message');
const { isRealString } = require('./utilities/validation');
const { Users } = require('./utilities/users');

// declare instance of users
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', socket => {

  socket.on('disconnect', () => {
    // remove user incase user already exists in list
    var removedUser = users.removeUser(socket.id);

    if (removedUser) {
      // send new users list to everyone in chatroom because users list has changed
      io.to(removedUser.room).emit('updateUserList', users.getUserList(removedUser.room));
      io.to(removedUser.room).emit('newMessage', generateMessage('Admin', `${removedUser.name} has left`));
    }

  });

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required');
    }

    // join the room specified in the params object
    socket.join(params.room);

    // remove user incase user already exists in list
    users.removeUser(socket.id);

    // add a user to users list
    users.addUser(socket.id, params.name, params.room);

    // send new users list to everyone in chatroom because users list has changed
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    // socket.emit sends the message once to the new user
    // who just joined the socket
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to Safe House Chat'));

    // socket.broadcast.emit sends the message to everyone but yourself
    // this is a way for everyone to know you just joined the socket
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has arrived`));
    callback();
  });



  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);
    // if a user is not found or the user's message is not a real message don't send
    if (user && isRealString(message.text)) {
      // io.emit sends newMessage to all connected sockets
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }

    // enacts callback which clears messageTextBox on client-side
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    // fetch user
    var user = users.getUser(socket.id);
    // only send message if user exists
    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

});

server.listen(PORT, () => {
  console.log("Server is available on port 3000");
});
