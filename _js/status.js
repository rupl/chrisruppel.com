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
