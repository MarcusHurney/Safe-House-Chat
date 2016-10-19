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

  // this accesses the text box where a user types a message to send
  var messageTextBox = jQuery('[name=message]');

  socket.emit('createMessage', {
    from: 'User',
    text: messageTextBox.val()
  }, function () {
    // clears value of text box after the server receives the message
    messageTextBox.val('');
  });
});

// code handling the send location button --->

var locationBtn = jQuery('#send-location');

locationBtn.on('click', function () {
  if (!navigator.geolocation) {
    alert('Geolocation not supported by your browser');
  }
  // once the button has been clicked, disable it to prevent
  // spamming or multiple clicks
  locationBtn.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    // location has been processed, enable button again
    locationBtn.removeAttr('disabled').text('Send location...');

    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    // location faled to process, still enable button again
    locationBtn.removeAttr('disabled').text('Send location...');
    alert('Unable to fetch location');
  });
});
