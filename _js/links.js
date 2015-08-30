var trip = document.querySelector('.story');
var paragraphs = document.querySelectorAll('.story > p');
var links = document.querySelector('.trip .links');

// If the links were found
if (links !== null) {
  // Make a copy of the links
  var copy = links.cloneNode(true);

  // Remove original links from DOM
  links.parentNode.removeChild(links);

  // Re-insert links shortly before the end of the story. If the story is very
  // short, insert them after first paragraph.
  var position = (paragraphs.length > 3) ? paragraphs[paragraphs.length - 2] : paragraphs[1];
  trip.insertBefore(copy, position);
}
