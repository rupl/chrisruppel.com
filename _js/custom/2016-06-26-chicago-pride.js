(function () {
  var title = document.querySelector('h1.title--main');
  var letters = title.innerText.split('');
  var size = letters.length;
  var inc = 330 / size;
  var output = '';

  // Color the letters.
  letters.forEach(function (element, index, array) {
    output += '<span style="text-transform: uppercase; color: hsl('+ (inc * index) +', 100%, 50%)">' + array[index] + ' </span>';
  });

  // Swap out the title.
  title.innerHTML = output;
})();
