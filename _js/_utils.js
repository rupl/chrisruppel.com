//
// Variables shared across files.
//
var OFFLINE_ARTICLE_PREFIX = 'chrisruppel-offline--';
var WEBMENTIONS_GET = '/webmentions/get/';
var WEBMENTIONS_POST = '/webmentions/post/';

//
// bling.js but using both qS and qSA
//
window.$ = document.querySelector.bind(document);
window.$$ = document.querySelectorAll.bind(document);

Node.prototype.on = window.on = function (name, fn) {
  this.addEventListener(name, fn);
}

NodeList.prototype.__proto__ = Array.prototype;

NodeList.prototype.on = NodeList.prototype.addEventListener = function (name, fn) {
  this.forEach(function (elem, i) {
    elem.on(name, fn);
  });
}


//
// Blur all form fields
//
// @see http://stackoverflow.com/a/29237391/175551
//
function blurAll() {
  var tmp = document.createElement("input");
  document.body.appendChild(tmp);
  tmp.focus();
  document.body.removeChild(tmp);
}

// Debounce
function debounce(func) {
  var wait = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];

  var timeout = void 0;
  return function () {
    var _this = this;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    clearTimeout(timeout);
    timeout = setTimeout(function () {
      func.apply(_this, args);
    }, wait);
  };
}
