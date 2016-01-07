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
    // Let the wisdom of the browser point us to the right image size, then set
    // it as the background-image on the picture element so we can take advantage
    // of all the nice CSS positioning built into the galleries pre-<picture>.
    photo.style.backgroundImage = 'url(' + photo.querySelector('img').currentSrc + ')';

    // Update background-image when currentSrc might have changed
    // photo.addEventListener('orientationchange', function () {
    //   photo.style.backgroundImage = 'url(' + photo.querySelector('img').currentSrc + ')';
    // });

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
