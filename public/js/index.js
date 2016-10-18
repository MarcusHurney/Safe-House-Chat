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

socket.on('newLocationMessage', function (message) {
  // create li element
  var li = jQuery('<li></li>');
  // target=_blank open page in a new tab
  var a = jQuery('<a target="_blank">My Current Location</a>');
  li.text(`${message.from}: `);
  // set anchor tag to google maps page of user's location
  a.attr('href', message.url);
  li.append(a);
  jQuery('#messages').append(li);
})

jQuery('#message-form').on('submit', function (event) {
  event.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function () {

  });
});

var locationBtn = jQuery('#send-location');

locationBtn.on('click', function () {
  if (!navigator.geolocation) {
    alert('Geolocation not supported by your browser');
  }

  navigator.geolocation.getCurrentPosition(function (position){
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    alert('Unable to fetch location');
  });
});
