var gallery = document.querySelector('.photos');

if (gallery) {
  gallery.addEventListener('click', function expandPhotos() {
    this.classList.toggle('photos--expanded');

    window.addEventListener('scroll', function collapsePhotos() {
      gallery.classList.remove('photos--expanded');
    });
  });
}
