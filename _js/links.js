var trip = document.querySelector('.trip');
var paragraphs = document.querySelectorAll('.trip p');
var links = document.querySelector('section.links');
var copy = links.cloneNode(true);

// Remove original links from DOM
links.parentNode.removeChild(links);

// Re-insert links shortly before the end of the story
trip.insertBefore(copy, paragraphs[paragraphs.length - 3]);
