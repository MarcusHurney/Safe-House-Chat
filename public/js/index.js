var socket = io();

socket.on('connect', function () {
  console.log("Connected to server");
});

socket.on('disconnect', function () {
  console.log("Disconnected from server");
});

// newMessage is what the server returns when the client
// run createMessage
socket.on('newMessage', function (message) {
  // create li element
  var li = jQuery('<li></li>');
  // insert the message's content into the li
  li.text(`${message.from}: ${message.text}`);
  // append li to the DOM
  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (event) {
  event.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function () {

  });
});
