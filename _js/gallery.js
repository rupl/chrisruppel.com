// Gallery
//
// TODO: don't write my own gallery

var gallery = document.querySelectorAll('.gallery .photo');
var forEach = Array.prototype.forEach;

// Did we find images?
if (gallery.length > 0) {
  processGalleryPhotos(gallery)
}

// Process the gallery photos
function processGalleryPhotos(photos) {
  forEach.call(photos, function (photo) {
    if (bigScreen()) {
      var hiRes = photo.style.backgroundImage.replace('@320', '');
      photo.style.backgroundImage = hiRes;
    }

    // Attach listeners for image captions
    photo.addEventListener('touchend', function toggleCaptions() {
      removeCaptions();
      this.classList.toggle('photo--caption');
    });
  });
}

// How big is the screen?
function bigScreen() {
  return (window.innerWidth > 640) || false;
}

function removeCaptions() {
  var captions = document.querySelectorAll('.photo--caption');
  forEach.call(captions, function (photo) {
    photo.classList.remove('photo--caption');
  });
}
