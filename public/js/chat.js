var socket = io();

function scrollToBottom() {

  // Selectors -------------------------------------->
  var messages = jQuery('#messages');
  // this will be the latest message by using last-child selector
  var newMessage = messages.children('li:last-child');

  // Heights -------------------------------------->
  var clientHeight = messages.prop('clientHeight'); // window's total height
  var scrollTop = messages.prop('scrollTop'); // the amount the client has scrolled down from the top
  var scrollHeight = messages.prop('scrollHeight'); // the total height of the messages div (total height)

  // this takes into account padding as well
  var newMessageHeight = newMessage.innerHeight();

  // prev method returns second to last child / previous child
  var lastMessageHeight = newMessage.prev().innerHeight();

  // if the client is NEAR the bottom, move client window to the bottom of the messages
  // div in the instance of a new message
  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    // move client to the bottom of the messages div
    messages.scrollTop(scrollHeight);
  }
}
socket.on('connect', function () {

  var params = jQuery.deparam(window.location.search);
  console.log(params);

  // join is a custom event that when received by the server
  // will set up a room
  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
});

socket.on('disconnect', function () {
  console.log("Disconnected from server");
});

socket.on('updateUserList', function (usersList) {
  var ul = jQuery('<ul></ul>');
  usersList.forEach(function (user) {
    ul.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ul);
});

// newMessage is what the server returns when the client
// run createMessage
socket.on('newMessage', function (message) {
  // formated time of message using moment
  var formattedTime = moment(message.createdAt).format('h:mm a');

  // create message template variable
  var template = jQuery('#message-template').html();

  // pass mustache the template and associated data from message
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  // append message template to the #messages div
  jQuery('#messages').append(html);

  scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
  // formated time of message using moment
  var formattedTime = moment(message.createdAt).format('h:mm a');

  // create message template variable
  var template = jQuery('#location-message-template').html();

  // pass mustache the template and associated data from message
  var html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  });

  // append message template to the #messages div
  jQuery('#messages').append(html);

  scrollToBottom();
})

jQuery('#message-form').on('submit', function (event) {
  event.preventDefault();

  // this accesses the text box where a user types a message to send
  var messageTextBox = jQuery('[name=message]');

  socket.emit('createMessage', {
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
