//
// Status notifications
//
// Sets a message and triggers the notification to be visible.
// The message will be hidden after a few seconds.
//
function displayMessage(message) {
  $('#status').setAttribute('aria-hidden', 'false');
  $('#message').innerText = message;
  $('#status').classList.add('is--displayed');
  setTimeout(hideMessage, 4000);
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

//
// Hide status bar
//
// It doesn't affect the contents, so no SR announcements will be made.
//
function hideMessage() {
  $('#status').classList.remove('is--displayed');
  $('#message').innetText = '';
  $('#status').setAttribute('aria-hidden', 'true');
}
