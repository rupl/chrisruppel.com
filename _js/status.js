//
// Status notifications
//
(function() {
  // Hide status messages when dismissed.
  $('#status .dismiss').on('click', function() {
    $('#status').classList.remove('displayed');
  });
})();

//
// Sets a message and triggers the notification to be visible.
//
function displayMessage(message) {
  $('#message').innerText = message;
  $('#status').classList.add('displayed');
}

//
// Append more text.
//
// Occasionally there are two events close in time which might want to notify
// the user of something. Use this to change the message instead of overwriting.
//
function appendMessage(message) {
  $('#message').innerText += ' ' + message;
}
