// Gallery
//
// TODO: don't write my own gallery

var gallery = document.querySelectorAll('.gallery .photo');
var forEach = Array.prototype.forEach;

// Did we find images? If yes, process them immediately.
if (gallery.length > 0) {
  processGalleryPhotos(gallery)
}

// Process the gallery photos
//
// Uses the result of the responsive images process to display properly-selected
// background-images in our gallery slots.
function processGalleryPhotos(photos) {
  forEach.call(photos, function (photo) {
    // Attach listeners for image captions
    photo.addEventListener('touchend', function toggleCaptions() {
      removeCaptions();
      this.classList.toggle('photo--caption');
    });
  });
}

// Helper function to close any captions that are currently open.
function removeCaptions() {
  var captions = document.querySelectorAll('.photo--caption');
  forEach.call(captions, function (photo) {
    photo.classList.remove('photo--caption');
  });
}
