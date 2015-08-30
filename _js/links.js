var trip = document.querySelector('.trip');
var paragraphs = document.querySelectorAll('.trip p');
var links = document.querySelector('section.links');

// If the links were found
if (links !== null) {
  // Make a copy of the links
  var copy = links.cloneNode(true);

  // Remove original links from DOM
  links.parentNode.removeChild(links);

  // Re-insert links shortly before the end of the story. If the story is very
  // short, insert them after first paragraph.
  var position = (paragraphs[paragraphs.length - 3] > 0) ? paragraphs[paragraphs.length - 3] : paragraphs[1];
  trip.insertBefore(copy, position);
}
