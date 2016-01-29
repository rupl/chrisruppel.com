//
// Trip entry enhancements
//

var entry_uid = document.querySelector('#uid');

if (entry_uid) {
  // Highlight permalink when clicked/tapped
  document.querySelector('#uid').addEventListener('click', copyUid);
  document.querySelector('label[for=uid]').addEventListener('click', copyUid);
}

function copyUid() {
  document.querySelector('#uid').select();
}
