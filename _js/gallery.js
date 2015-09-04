/*
var gallery = document.querySelectorAll('.gallery .photo');
var forEach = Array.prototype.forEach;

// Did we find images?
if (gallery.length > 0) {
  // Process images
  forEach.call(gallery, function (photo) {
    // Attach listeners for image enlargement
    photo.addEventListener('click', function expandPhotos() {
      this.classList.toggle('expanded');

      window.addEventListener('scroll', function collapsePhotos() {
        photo.classList.remove('expanded');
      });
    });
  });
}
*/
